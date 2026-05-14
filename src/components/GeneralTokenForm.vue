<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑通用 Token' : '添加通用 Token'"
    direction="rtl"
    size="360px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <div class="form-content">
      <!-- 名称 -->
      <div class="form-group">
        <label class="form-label">名称</label>
        <el-input
          v-model="form.name"
          placeholder="如：GitHub Token"
          size="large"
          class="full-width"
        />
      </div>

      <!-- Token 值 -->
      <div class="form-group">
        <label class="form-label">Token 值</label>
        <el-input
          v-model="form.value"
          placeholder="输入 Token 字符串"
          size="large"
          class="full-width font-mono"
          type="textarea"
          :rows="3"
          show-password
        />
      </div>

      <!-- 分类 -->
      <div class="form-group">
        <label class="form-label">分类</label>
        <el-select
          v-model="form.category"
          placeholder="选择分类"
          size="large"
          class="full-width"
          filterable
          allow-create
          default-first-option
        >
          <el-option
            v-for="cat in categoryList"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          >
            <div class="category-option">
              <span class="category-dot" :style="{ background: cat.color }"></span>
              <span>{{ cat.name }}</span>
            </div>
          </el-option>
        </el-select>
      </div>

      <!-- 备注 -->
      <div class="form-group">
        <label class="form-label">备注 <span class="label-optional">(可选)</span></label>
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="备注信息"
          :rows="2"
          class="full-width"
        />
      </div>
    </div>

    <div class="drawer-footer">
      <el-button @click="visible = false" size="large">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading" size="large" class="submit-btn">
        {{ isEdit ? '保存' : '添加' }}
      </el-button>
    </div>

    <!-- 草稿恢复提示 -->
    <div v-if="draftRestored" class="draft-banner">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      已恢复上次未保存的内容
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { CATEGORY_LIST } from '../data/generalCategories.js';
import { useAutoSave } from '../composables/useAutoSave.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  token: { type: Object, default: null }
});

const emit = defineEmits(['update:modelValue', 'submit']);

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
});

const isEdit = computed(() => !!props.token);

const categoryList = CATEGORY_LIST;

// 默认表单
const defaultForm = () => ({
  name: '',
  value: '',
  category: 'other',
  remark: ''
});

const form = ref(defaultForm());
const loading = ref(false);
const draftRestored = ref(false);

// 自动保存（草稿 key 为 generalTokenDraft，与 AI Token 的 draft 隔离）
const { restoreDraft, saveDraft, clearDraft } = useAutoSave(() => ({
  name: form.value.name,
  value: form.value.value,
  category: form.value.category,
  remark: form.value.remark
}), 'generalTokenDraft');

// 监听表单变化，自动保存
watch(form, (val) => {
  if (visible.value && !isEdit.value) {
    saveDraft(val);
  }
}, { deep: true });

// 打开弹窗时：编辑模式用 token 填充表单，添加模式恢复草稿
watch(visible, async (val) => {
  if (val) {
    await nextTick();
    if (props.token) {
      form.value = { ...defaultForm(), ...props.token };
    } else {
      const draft = restoreDraft();
      if (draft) {
        form.value = { ...defaultForm(), ...draft };
        draftRestored.value = true;
        setTimeout(() => { draftRestored.value = false; }, 3000);
      }
    }
  }
});

function handleClosed() {
  form.value = defaultForm();
  draftRestored.value = false;
}

async function handleSubmit() {
  if (!form.value.name.trim()) {
    ElMessage.warning('请输入名称');
    return;
  }
  if (!form.value.value.trim()) {
    ElMessage.warning('请输入 Token 值');
    return;
  }

  loading.value = true;
  try {
    emit('submit', { ...form.value });
    if (!isEdit.value) {
      clearDraft();
    }
    visible.value = false;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.form-content {
  padding: 0 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.label-optional {
  color: #9ca3af;
  font-weight: 400;
}

.full-width {
  width: 100%;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.drawer-footer {
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.submit-btn {
  min-width: 80px;
}

.draft-banner {
  position: absolute;
  top: 56px;
  left: 0;
  right: 0;
  background: #eff6ff;
  color: #3b82f6;
  padding: 8px 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 1;
}

:deep(.el-input--large) {
  font-size: 14px;
}

:deep(.el-input__inner) {
  font-size: 14px !important;
}
</style>
