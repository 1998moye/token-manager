// 在线模型更新服务 — 从 DataLearner 抓取最新模型列表
const DATA_LEARNER_BASE = 'https://www.datalearner.com/ai-models/pretrained-models';

// 平台关键词映射规则（与 platforms.js 中的平台一一对应）
const PLATFORM_RULES = [
  { id: 'openai', keywords: ['gpt-', 'GPT-', 'o3', 'o4-mini', 'chat-gpt', 'openai-o', 'openai-gpt'], exclude: ['AudioGPT','BloombergGPT','Cerebras-GPT','Distil-Whisper','GPT4All','GPT-J','GPT-JT','GPT-Neo','h2oGPT','InstructGPT','LightGPT','OpenAssistant','OpenChat','OpenLLaMA','stanford-alpaca','Wizard','GPT-oss'] },
  { id: 'anthropic', keywords: ['claude', 'Claude'] },
  { id: 'google', keywords: ['gemini', 'Gemma-', 'gemma-', 'google-gemma', 'google-nano', 'PaliGemma'] },
  { id: 'deepseek', keywords: ['deepseek', 'DeepSeek'] },
  { id: 'dashscope', keywords: ['qwen', 'Qwen'] },
  { id: 'zhipu', keywords: ['glm', 'GLM', 'ChatGLM'] },
  { id: 'lingyi', keywords: ['Yi-', 'yi-', 'Yi_'] },
  { id: 'minimax', keywords: ['minimax', 'MiniMax'] },
  { id: 'moonshot', keywords: ['kimi', 'Kimi'] },
  { id: 'doubao', keywords: ['doubao', 'seed'] },
  { id: 'wenxin', keywords: ['ernie', 'ERNIE', 'baidu-ernie'] },
  { id: 'hunyuan', keywords: ['hunyuan', 'Hunyuan', 'tencent-hunyuan'] },
  { id: 'baichuan', keywords: ['baichuan', 'Baichuan'] },
  { id: 'stepfun', keywords: ['step3', 'stepfun', 'nextstep'] },
  { id: 'xai', keywords: ['grok', 'Grok'] },
  { id: 'together', keywords: ['llama', 'LLaMA', 'Llama'] },
  { id: 'mistral', keywords: ['mistral', 'Mistral'] },
  { id: 'cohere', keywords: ['cohere', 'Cohere', 'command'] },
  { id: 'perplexity', keywords: ['sonar'] },
];

function matchPlatform(name) {
  for (const rule of PLATFORM_RULES) {
    let matched = false;
    for (const kw of rule.keywords) {
      if (name.includes(kw)) { matched = true; break; }
    }
    if (matched && rule.exclude) {
      for (const ex of rule.exclude) {
        if (name.includes(ex)) return null;
      }
    }
    if (matched) return rule.id;
  }
  return null;
}

/**
 * 从 DataLearner 抓取模型数据
 * @returns {Promise<{[platformId: string]: string[]}>}
 */
export async function fetchModelsFromDataLearner() {
  const allModels = [];
  const maxPage = 18;

  for (let page = 1; page <= maxPage; page++) {
    try {
      const res = await fetch(`${DATA_LEARNER_BASE}?page=${page}`);
      if (!res.ok) continue;
      const html = await res.text();
      const matches = [...html.matchAll(/models\/pretrained-models\/([a-zA-Z0-9._/-]+)/g)];
      const models = [...new Set(matches.map(m => m[1]))];
      allModels.push(...models);
    } catch (e) {
      console.warn(`[modelUpdater] 抓取第 ${page} 页失败`, e.message);
    }
  }

  const uniqueModels = [...new Set(allModels)];
  const platformMap = {};

  for (const m of uniqueModels) {
    const pid = matchPlatform(m);
    if (!pid) continue;
    if (!platformMap[pid]) platformMap[pid] = [];
    platformMap[pid].push(m.toLowerCase().replace(/_/g, '-'));
  }

  // 排序去重
  for (const pid in platformMap) {
    platformMap[pid] = [...new Set(platformMap[pid])].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }

  return platformMap;
}

/**
 * 将抓取的模型数据保存到 storage 并更新内存
 * @param {{[platformId: string]: string[]}} platformMap
 */
export async function saveFetchedModels(platformMap) {
  const { setCustomModels } = await import('../data/platforms.js');
  const storageData = {};

  for (const [pid, models] of Object.entries(platformMap)) {
    const key = `custom_models_${pid}`;
    storageData[key] = models;
    setCustomModels(pid, models);
  }

  await chrome.storage.local.set(storageData);
}

/**
 * 清除所有自定义模型，恢复默认
 */
export async function resetToDefaultModels() {
  const { clearCustomModels } = await import('../data/platforms.js');
  const allKeys = Object.keys(await chrome.storage.local.get(null));
  const customKeys = allKeys.filter(k => k.startsWith('custom_models_'));
  if (customKeys.length > 0) {
    await chrome.storage.local.remove(customKeys);
  }
  for (const key of customKeys) {
    const pid = key.replace('custom_models_', '');
    clearCustomModels(pid);
  }
}
