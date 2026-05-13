// 18 个 AI 平台配置
// 每个平台：id / name / color（主题色） / logo（单字母） / baseUrl / models

export const PLATFORMS = {
  // ===== 国际大厂 =====
  openai: {
    id: 'openai',
    name: 'OpenAI',
    nameCn: 'OpenAI',
    color: '#10A37F',
    logo: 'O',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4o-2024-11-20',
      'gpt-4-turbo',
      'gpt-4-turbo-2024-04-09',
      'gpt-4',
      'gpt-4-0613',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
      'o1',
      'o1-mini',
      'o1-preview',
      'o3',
      'o3-mini',
      'o3-mini-2025-01-31',
      'chatgpt-4o-latest',
      'gpt-4o-realtime-preview'
    ]
  },

  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    nameCn: 'Anthropic',
    color: '#D4A574',
    logo: 'A',
    baseUrl: 'https://api.anthropic.com',
    models: [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-20240620',
      'claude-3-5-haiku-20241022',
      'claude-3-5-haiku-20240620',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
      'claude-opus-4-20250514',
      'claude-sonnet-4-20250514',
      'claude-haiku-4-20250514',
      'claude-3-5-sonnet-latest'
    ]
  },

  google: {
    id: 'google',
    name: 'Google',
    nameCn: 'Google Gemini',
    color: '#4285F4',
    logo: 'G',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      'gemini-2.0-flash',
      'gemini-2.0-flash-exp',
      'gemini-2.0-flash-lite',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-1.5-pro',
      'gemini-exp-1206'
    ]
  },

  groq: {
    id: 'groq',
    name: 'Groq',
    nameCn: 'Groq',
    color: '#7B68EE',
    logo: 'Gq',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'llama-3.2-1b-preview',
      'llama-3.2-3b-preview',
      'llama-3.2-11b-vision-preview',
      'llama-3.2-90b-text-instruct',
      'mixtral-8x7b-32768',
      'gemma-7b-it'
    ]
  },

  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    nameCn: 'Mistral AI',
    color: '#CB2D4A',
    logo: 'M',
    baseUrl: 'https://api.mistral.ai/v1',
    models: [
      'mistral-large-latest',
      'mistral-small-latest',
      'mistral-medium-latest',
      'codestral-latest',
      'codestral-2501',
      'mistral-tiny',
      'mistral-nemo-2407'
    ]
  },

  cohere: {
    id: 'cohere',
    name: 'Cohere',
    nameCn: 'Cohere',
    color: '#2B5876',
    logo: 'C',
    baseUrl: 'https://api.cohere.ai/v1',
    models: [
      'command-r-plus-08-2024',
      'command-r-plus',
      'command-r7b-12-2024',
      'command-r',
      'command-medium-nightly',
      'c4ai- command-r-08-2024'
    ]
  },

  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    nameCn: 'Perplexity',
    color: '#20B4F5',
    logo: 'P',
    baseUrl: 'https://api.perplexity.ai',
    models: [
      'sonar-pro',
      'sonar-reasoning-pro',
      'sonar-reasoning',
      'sonar'
    ]
  },

  // ===== 国内大厂 =====
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    nameCn: 'DeepSeek',
    color: '#2B9BF4',
    logo: 'D',
    baseUrl: 'https://api.deepseek.com',
    models: [
      'deepseek-chat',
      'deepseek-coder',
      'deepseek-coder-32b',
      'deepseek-reasoner',
      'deepseek-r1',
      'deepseek-r1-32b',
      'deepseek-r1-70b',
      'deepseek-v3',
      'deepseek-v3-0324'
    ]
  },

  moonshot: {
    id: 'moonshot',
    name: 'Kimi',
    nameCn: 'Kimi (Moonshot)',
    color: '#8B5CF6',
    logo: 'K',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: [
      'moonshot-v1-8k',
      'moonshot-v1-32k',
      'moonshot-v1-128k'
    ]
  },

  minimax: {
    id: 'minimax',
    name: 'MiniMax',
    nameCn: 'MiniMax',
    color: '#00C853',
    logo: 'Mi',
    baseUrl: 'https://api.minimax.chat/v1',
    models: [
      'MiniMax-Text-01',
      'MiniMax-Embed-02',
      'MiniMax-M2',
      'MiniMax-M2.7',
      'MiniMax-M2.5',
      'MiniMax-M2.1',
      'MiniMax-M2-Ultra',
      'abab6-chat',
      'abab6.5s-chat',
      'abab6.5-chat'
    ]
  },

  doubao: {
    id: 'doubao',
    name: '豆包',
    nameCn: '豆包 (字节)',
    color: '#FF6B6B',
    logo: 'Do',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    models: [
      'doubao-pro-32k',
      'doubao-pro-4k',
      'doubao-pro-32k-240615',
      'doubao-lite-32k',
      'doubao-lite-4k'
    ]
  },

  dashscope: {
    id: 'dashscope',
    name: '通义千问',
    nameCn: '通义千问 (阿里)',
    color: '#FF6A00',
    logo: 'Q',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      'qwen-plus',
      'qwen-plus-latest',
      'qwen-turbo',
      'qwen-turbo-latest',
      'qwen-max',
      'qwen-max-longcontext',
      'qwen2.5-72b-instruct',
      'qwen2.5-32b-instruct',
      'qwen2.5-14b-instruct',
      'qwen2.5-7b-instruct',
      'qwen2.5-coder-32b-instruct',
      'qwen2.5-math-72b-instruct',
      'qwen-long',
      'qwen-audio-turbo',
      'qwen-vl-plus',
      'qwen-vl-max'
    ]
  },

  wenxin: {
    id: 'wenxin',
    name: '文心一言',
    nameCn: '文心一言 (百度)',
    color: '#4A90D9',
    logo: 'W',
    baseUrl: 'https://qianfan.baidubce.com/v2',
    models: [
      'ernie-4.0-8k',
      'ernie-4.0-8k-preview',
      'ernie-4.0-6k',
      'ernie-3.5-8k',
      'ernie-3.5-8k-pro',
      'ernie-speed-128k',
      'ernie-speed-8k',
      'ernie-lite-8k',
      'ernie-character-8k'
    ]
  },

  hunyuan: {
    id: 'hunyuan',
    name: '混元',
    nameCn: '混元 (腾讯)',
    color: '#E53935',
    logo: 'H',
    baseUrl: 'https://api.hunyuan.cloud.tencent.com',
    models: [
      'hunyuan-turb',
      'hunyuan-pro',
      'hunyuan-lite'
    ]
  },

  zhipu: {
    id: 'zhipu',
    name: '智谱',
    nameCn: '智谱 GLM',
    color: '#5B9BD5',
    logo: 'Z',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      'glm-4-plus',
      'glm-4-flash',
      'glm-4',
      'glm-4v-plus',
      'glm-4v',
      'glm-4-airx',
      'glm-4-air',
      'glm-4-long',
      'glm-z1c-32k',
      'glm-3-turbo'
    ]
  },

  stepfun: {
    id: 'stepfun',
    name: '阶跃星辰',
    nameCn: '阶跃星辰',
    color: '#6B5CE7',
    logo: 'S',
    baseUrl: 'https://api.stepfun.com/v1',
    models: [
      'step-2-16k',
      'step-2-mini-32k',
      'step-1-vision-32k',
      'step-1-o1'
    ]
  },

  lingyi: {
    id: 'lingyi',
    name: '零一万物',
    nameCn: '零一万物',
    color: '#FF4757',
    logo: 'Y',
    baseUrl: 'https://api.lingyiwanwu.com/v1',
    models: [
      'yi-lightning',
      'yi-34b-chat',
      'yi-large',
      'yi-large-rag'
    ]
  },

  baichuan: {
    id: 'baichuan',
    name: '百川智能',
    nameCn: '百川智能',
    color: '#52C41A',
    logo: 'B',
    baseUrl: 'https://api.baichuan-ai.com/v1',
    models: [
      'baichuan4-turbo',
      'baichuan4-air',
      'baichuan3-turbo-128k',
      'baichuan3-turbo',
      'baichuan3-5-turbo',
      'baichuan3-5-suno'
    ]
  },

  // ===== 聚合平台 =====
  siliconflow: {
    id: 'siliconflow',
    name: 'SiliconFlow',
    nameCn: 'SiliconFlow',
    color: '#00D4AA',
    logo: 'SF',
    baseUrl: 'https://api.siliconflow.cn/v1',
    models: [
      'deepseek-ai/DeepSeek-V3',
      'deepseek-ai/DeepSeek-R1',
      'Qwen/Qwen2.5-72B-Instruct',
      'Qwen/Qwen2.5-32B-Instruct',
      'THUDM/GLM-4-9B-Chat',
      'mistralai/Mistral-7B-Instruct-v0.3',
      'deepseek-ai/DeepSeek-Coder-V2-16B',
      'Anthropic/claude-3.5-sonnet-20241022',
      'Qwen/Qwen2-VL-72B-Instruct',
      'google/gemini-2.0-flash-exp'
    ]
  },

  siliconcloud: {
    id: 'siliconcloud',
    name: 'SiliconCloud',
    nameCn: 'SiliconCloud',
    color: '#00B4A0',
    logo: 'SC',
    baseUrl: 'https://api.siliconcloud.cn/v1',
    models: [
      'deepseek-ai/DeepSeek-V3',
      'deepseek-ai/DeepSeek-R1',
      'Qwen/Qwen2.5-72B-Instruct',
      'THUDM/GLM-4-9B-Chat',
      'mistralai/Mistral-7B-Instruct-v0.3'
    ]
  },

  together: {
    id: 'together',
    name: 'Together AI',
    nameCn: 'Together AI',
    color: '#9B59B6',
    logo: 'T',
    baseUrl: 'https://api.together.xyz/v1',
    models: [
      'meta-llama/Llama-4-Maverick-17B-128E-Instruct',
      'meta-llama/Llama-4-Scout-17B-16E-Instruct',
      'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'mistralai/Mixtral-8x22B-Instruct-v0.1',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
      'deepseek-ai/DeepSeek-V3'
    ]
  },

  // ===== 其他 =====
  xai: {
    id: 'xai',
    name: 'xAI Grok',
    nameCn: 'xAI Grok',
    color: '#F97316',
    logo: 'X',
    baseUrl: 'https://api.x.ai/v1',
    models: [
      'grok-2',
      'grok-2-mini',
      'grok-beta',
      'grok-2-1212',
      'grok-2-mini-1212'
    ]
  },

  ollama: {
    id: 'ollama',
    name: 'Ollama',
    nameCn: 'Ollama (本地)',
    color: '#4A4A4A',
    logo: 'OL',
    baseUrl: 'http://localhost:11434/v1',
    models: [
      'llama3',
      'llama3.1',
      'llama3.2',
      'mistral',
      'codellama',
      'qwen2.5',
      'deepseek-r1',
      'phi3',
      'gemma2'
    ]
  }
};

// 平台列表（用于下拉选择，按类别分组）
export const PLATFORM_GROUPS = {
  '国际大厂': ['openai', 'anthropic', 'google', 'groq', 'mistral', 'cohere', 'perplexity'],
  '国内大厂': ['deepseek', 'moonshot', 'minimax', 'doubao', 'dashscope', 'wenxin', 'hunyuan', 'zhipu', 'stepfun', 'lingyi', 'baichuan'],
  '聚合平台': ['siliconflow', 'siliconcloud', 'together'],
  '其他': ['xai', 'ollama']
};

// 导出平台列表（flat）
export const PLATFORM_LIST = Object.values(PLATFORMS);

// 根据 ID 获取平台信息
export function getPlatform(id) {
  return PLATFORMS[id] || null;
}

// 根据平台 ID 获取模型列表
export function getModelsByPlatform(platformId) {
  const platform = PLATFORMS[platformId];
  return platform ? platform.models : [];
}

// API Key 脱敏
export function maskApiKey(key) {
  if (!key) return '';
  if (key.length <= 8) return key.slice(0, 3) + '***';
  return key.slice(0, 6) + '***' + key.slice(-4);
}