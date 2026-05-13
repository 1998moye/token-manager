<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑 Token' : '添加 Token'"
    direction="rtl"
    size="360px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <div class="form-content">
      <!-- 平台选择 -->
      <div class="form-group">
        <label class="form-label">平台</label>
        <el-select
          v-model="form.platform"
          placeholder="选择平台"
          size="large"
          class="full-width"
          @change="handlePlatformChange"
        >
          <el-option-group
            v-for="(ids, group) in platformGroups"
            :key="group"
            :label="group"
          >
            <el-option
              v-for="id in ids"
              :key="id"
              :label="platformMap[id]?.nameCn"
              :value="id"
            >
              <div class="platform-option">
                <span class="platform-dot" :style="{ background: platformMap[id]?.color }"></span>
                <span>{{ platformMap[id]?.nameCn }}</span>
              </div>
            </el-option>
          </el-option-group>
        </el-select>
      </div>

      <!-- 模型选择 -->
      <div class="form-group">
        <label class="form-label">模型</label>
        <el-select
          v-model="form.model"
          placeholder="选择模型"
          size="large"
          class="full-width"
          filterable
          allow-create
          default-first-option
        >
          <el-option
            v-for="model in currentModels"
            :key="model"
            :label="model"
            :value="model"
          />
        </el-select>
      </div>

      <!-- 名称 -->
      <div class="form-group">
        <label class="form-label">名称</label>
        <el-input
          v-model="form.name"
          placeholder="如：我的 OpenAI Key"
          size="large"
          class="full-width"
        />
      </div>

      <!-- API 地址 -->
      <div class="form-group">
        <label class="form-label">API 地址</label>
        <el-input
          v-model="form.baseUrl"
          placeholder="https://api.openai.com/v1"
          size="large"
          class="full-width"
        />
      </div>

      <!-- API Key -->
      <div class="form-group">
        <label class="form-label">API Key</label>
        <el-input
          v-model="form.apiKey"
          placeholder="sk-xxxxxxxx"
          size="large"
          class="full-width font-mono"
          type="password"
          show-password
        />
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
import { PLATFORMS, PLATFORM_GROUPS, getModelsByPlatform } from '../data/platforms.js';
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

// 构建平台 Map 方便查找
const platformMap = computed(() => {
  const map = {};
  Object.values(PLATFORMS).forEach(p => { map[p.id] = p; });
  return map;
});

const platformGroups = PLATFORM_GROUPS;

// 当前平台的模型列表
const currentModels = computed(() => {
  if (!form.value.platform) return [];
  return getModelsByPlatform(form.value.platform);
});

// 默认表单
const defaultForm = () => ({
  platform: 'openai',
  model: '',
  name: '',
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  remark: ''
});

const form = ref(defaultForm());
const loading = ref(false);
const draftRestored = ref(false);

// 自动保存
const { restoreDraft, saveDraft, clearDraft } = useAutoSave(() => ({
  platform: form.value.platform,
  model: form.value.model,
  name: form.value.name,
  baseUrl: form.value.baseUrl,
  apiKey: form.value.apiKey,
  remark: form.value.remark
}));

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
      // 编辑模式：用已有数据填充表单
      form.value = { ...defaultForm(), ...props.token };
    } else {
      // 添加模式：恢复草稿
      const draft = restoreDraft();
      if (draft) {
        form.value = { ...defaultForm(), ...draft };
        draftRestored.value = true;
        setTimeout(() => { draftRestored.value = false; }, 3000);
      }
    }
  }
});

// 切换平台时自动填充 API 地址和模型列表
function handlePlatformChange(platformId) {
  const platform = PLATFORMS[platformId];
  if (platform) {
    form.value.baseUrl = platform.baseUrl;
    if (!form.value.model || currentModels.value.includes(form.value.model)) {
      // 保持当前选择或自动填第一个
    }
  }
}

function handleClosed() {
  // 关闭时重置表单，避免下次打开残留数据
  form.value = defaultForm();
  draftRestored.value = false;
}

async function handleSubmit() {
  if (!form.value.platform) {
    ElMessage.warning('请选择平台');
    return;
  }
  if (!form.value.name.trim()) {
    ElMessage.warning('请输入名称');
    return;
  }
  if (!form.value.apiKey.trim()) {
    ElMessage.warning('请输入 API Key');
    return;
  }

  loading.value = true;
  try {
    // 如果模型为空，自动填第一个
    if (!form.value.model && currentModels.value.length > 0) {
      form.value.model = currentModels.value[0];
    }

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

.platform-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-dot {
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

:deep(.el-select .el-input__wrapper) {
  padding-left: 12px !important;
}
</style>
