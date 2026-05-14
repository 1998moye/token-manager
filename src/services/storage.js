const STORAGE_KEY_TOKENS = 'tokens';
const STORAGE_KEY_SETTINGS = 'settings';

export async function getTokens() {
  const result = await chrome.storage.local.get(STORAGE_KEY_TOKENS);
  return result[STORAGE_KEY_TOKENS] || [];
}

export async function saveTokens(tokens) {
  await chrome.storage.local.set({ [STORAGE_KEY_TOKENS]: tokens });
}

export async function addToken(token) {
  const tokens = await getTokens();
  const newToken = {
    ...token,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tokens.push(newToken);
  await saveTokens(tokens);
  return newToken;
}

export async function updateToken(id, updates) {
  const tokens = await getTokens();
  const index = tokens.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Token not found');
  tokens[index] = { ...tokens[index], ...updates, updatedAt: new Date().toISOString() };
  await saveTokens(tokens);
  return tokens[index];
}

export async function deleteToken(id) {
  const tokens = await getTokens();
  const filtered = tokens.filter(t => t.id !== id);
  await saveTokens(filtered);
}

export async function getSettings() {
  const result = await chrome.storage.local.get(STORAGE_KEY_SETTINGS);
  return result[STORAGE_KEY_SETTINGS] || {
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  };
}

export async function saveSettings(settings) {
  await chrome.storage.local.set({ [STORAGE_KEY_SETTINGS]: settings });
}

// --- 自定义模型列表 ---

export async function getCustomModels(platformId) {
  const key = `custom_models_${platformId}`;
  const result = await chrome.storage.local.get(key);
  return result[key] || null;
}

export async function saveCustomModels(platformId, models) {
  await chrome.storage.local.set({ [`custom_models_${platformId}`]: models });
}

export async function clearAllCustomModels() {
  const allKeys = Object.keys(await chrome.storage.local.get(null));
  const customKeys = allKeys.filter(k => k.startsWith('custom_models_'));
  if (customKeys.length > 0) {
    await chrome.storage.local.remove(customKeys);
  }
}

// --- 通用 Token ---

const STORAGE_KEY_GENERAL_TOKENS = 'generalTokens';

export async function getGeneralTokens() {
  const result = await chrome.storage.local.get(STORAGE_KEY_GENERAL_TOKENS);
  return result[STORAGE_KEY_GENERAL_TOKENS] || [];
}

export async function saveGeneralTokens(tokens) {
  await chrome.storage.local.set({ [STORAGE_KEY_GENERAL_TOKENS]: tokens });
}

export async function addGeneralToken(token) {
  const tokens = await getGeneralTokens();
  const newToken = {
    ...token,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tokens.push(newToken);
  await saveGeneralTokens(tokens);
  return newToken;
}

export async function updateGeneralToken(id, updates) {
  const tokens = await getGeneralTokens();
  const index = tokens.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Token not found');
  tokens[index] = { ...tokens[index], ...updates, updatedAt: new Date().toISOString() };
  await saveGeneralTokens(tokens);
  return tokens[index];
}

export async function deleteGeneralToken(id) {
  const tokens = await getGeneralTokens();
  const filtered = tokens.filter(t => t.id !== id);
  await saveGeneralTokens(filtered);
}
