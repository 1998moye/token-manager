export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (err) {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// 复制 ccswitch profile JSON 片段（可直接粘贴进 ccswitch 配置文件的 profiles 父对象）
// 输出形如：
//   "<token.name>": {
//     "env": { ANTHROPIC_AUTH_TOKEN, ANTHROPIC_BASE_URL, 5 个 _MODEL },
//     "includeCoAuthoredBy": false
//   }
// platformName 参数保留以兼容调用方，不再使用
export async function copyTokenConfig(token, platformName) {
  const profile = {
    env: {
      ANTHROPIC_AUTH_TOKEN: token.apiKey,
      ANTHROPIC_BASE_URL: token.baseUrl,
      ANTHROPIC_DEFAULT_HAIKU_MODEL: token.model,
      ANTHROPIC_DEFAULT_OPUS_MODEL: token.model,
      ANTHROPIC_DEFAULT_SONNET_MODEL: token.model,
      ANTHROPIC_MODEL: token.model,
      ANTHROPIC_REASONING_MODEL: token.model
    },
    includeCoAuthoredBy: false
  };
  const text = `${JSON.stringify(token.name)}: ${JSON.stringify(profile, null, 2)}`;
  return copyToClipboard(text);
}
