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
