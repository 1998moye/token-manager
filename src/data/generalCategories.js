// 通用 Token 分类配置
export const GENERAL_CATEGORIES = {
  git: { id: 'git', name: 'Git', color: '#f14e32' },
  npm: { id: 'npm', name: 'NPM', color: '#cb3837' },
  cloud: { id: 'cloud', name: '云服务', color: '#3b82f6' },
  other: { id: 'other', name: '其他', color: '#94a3b8' }
};

export const CATEGORY_LIST = Object.values(GENERAL_CATEGORIES);

// 根据 ID 获取分类信息
export function getCategory(id) {
  return GENERAL_CATEGORIES[id] || { id: id || 'other', name: id || '其他', color: '#94a3b8' };
}

// Token 值脱敏（与 AI Token 的 maskApiKey 规则一致）
export function maskTokenValue(value) {
  if (!value) return '';
  if (value.length <= 8) return value.slice(0, 3) + '***';
  return value.slice(0, 6) + '***' + value.slice(-4);
}
