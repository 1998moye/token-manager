import { ref, watch, onUnmounted } from 'vue';

/**
 * 表单自动保存 composable
 * @param {Function} getFormData - 获取表单数据的函数
 * @param {string} storageKey - localStorage key，默认 'token-form-draft'
 */
export function useAutoSave(getFormData, storageKey = 'token-form-draft') {
  const isRestored = ref(false);

  // 恢复草稿
  function restoreDraft() {
    try {
      const draft = localStorage.getItem(storageKey);
      if (draft) {
        return JSON.parse(draft);
      }
    } catch (e) {
      // ignore
    }
    return null;
  }

  // 保存草稿
  function saveDraft(data) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      // ignore - storage 可能满
    }
  }

  // 清除草稿
  function clearDraft() {
    localStorage.removeItem(storageKey);
  }

  // 检查是否有草稿
  function hasDraft() {
    return localStorage.getItem(storageKey) !== null;
  }

  // 手动保存
  function manualSave() {
    const data = getFormData();
    if (data) {
      saveDraft(data);
    }
  }

  return {
    isRestored,
    restoreDraft,
    saveDraft,
    clearDraft,
    hasDraft,
    manualSave
  };
}
