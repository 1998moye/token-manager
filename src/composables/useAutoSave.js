import { ref, watch, onUnmounted } from 'vue';

const DRAFT_KEY = 'token-form-draft';

/**
 * 表单自动保存 composable
 * @param {Ref} formRef - 表单 ref
 * @param {Function} getFormData - 获取表单数据的函数
 */
export function useAutoSave(getFormData) {
  const isRestored = ref(false);

  // 恢复草稿
  function restoreDraft() {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
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
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore - storage 可能满
    }
  }

  // 清除草稿
  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }

  // 检查是否有草稿
  function hasDraft() {
    return localStorage.getItem(DRAFT_KEY) !== null;
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
