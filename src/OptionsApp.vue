<template>
  <div class="options-container">
    <!-- 顶部 Header -->
    <div class="options-header">
      <h1 class="options-title">Token 管理器</h1>
      <p class="options-subtitle">支持 22 个 AI 平台 / 一键复制 / 表单自动保存</p>
    </div>

    <div class="options-main">
      <!-- 左侧：Token 列表 -->
      <div class="panel-left">
        <div class="panel-toolbar">
          <el-input
            v-model="searchText"
            placeholder="搜索 Token..."
            clearable
            size="default"
            class="search-input"
          >
            <template #prefix>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </template>
          </el-input>
          <el-button type="primary" @click="openAddForm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:4px">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            添加 Token
          </el-button>
        </div>

        <div class="token-list">
          <template v-if="filteredTokens.length > 0">
            <TokenCard
              v-for="token in filteredTokens"
              :key="token.id"
              :token="token"
              @edit="openEditForm"
              @delete="openDeleteConfirm"
            />
          </template>
          <div v-else-if="!searchText" class="empty-hint">
            <p>暂无 Token，点击「添加 Token」开始</p>
          </div>
          <div v-else class="empty-hint">
            <p>未找到匹配项</p>
          </div>
        </div>

        <!-- 底部导入导出 -->
        <div class="list-footer">
          <el-button text size="small" @click="handleImport">导入 JSON</el-button>
          <el-button text size="small" @click="handleExport" :disabled="!tokens.length">导出 JSON</el-button>
        </div>
      </div>

      <!-- 右侧：设置面板 -->
      <div class="panel-right">
        <h2 class="section-title">全局设置</h2>

        <div class="setting-group">
          <label class="setting-label">默认排序</label>
          <div class="setting-row">
            <el-select v-model="settings.sortBy" size="default" style="width: 140px">
              <el-option label="最近更新" value="updatedAt" />
              <el-option label="创建时间" value="createdAt" />
              <el-option label="名称" value="name" />
              <el-option label="平台" value="platform" />
            </el-select>
            <el-select v-model="settings.sortOrder" size="default" style="width: 90px">
              <el-option label="倒序" value="desc" />
              <el-option label="正序" value="asc" />
            </el-select>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">Token 总数</label>
          <span class="setting-value">{{ tokens.length }} 个</span>
        </div>

        <el-divider />

        <el-divider />

        <div class="setting-group">
          <label class="setting-label">模型列表</label>
          <div class="setting-row" style="flex-wrap: wrap; gap: 8px;">
            <el-button
              type="primary"
              size="default"
              :loading="updatingModels"
              @click="handleUpdateModels"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:4px">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              更新模型列表
            </el-button>
            <el-button
              size="default"
              :disabled="!hasCustomModels"
              @click="handleResetModels"
            >
              恢复默认
            </el-button>
          </div>
          <p class="setting-hint">
            从 DataLearner 同步最新模型数据
          </p>
        </div>

        <div class="setting-group">
          <label class="setting-label">关于</label>
          <p class="about-text">
            Token 管理器 v2.0.0<br/>
            支持 OpenAI / Anthropic / DeepSeek / Kimi 等 22 个平台
          </p>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input type="file" ref="fileInputRef" accept=".json" style="display:none" @change="handleFileImport" />

    <!-- 表单弹窗 -->
    <TokenForm
      v-model="formVisible"
      :token="currentToken"
      @submit="handleFormSubmit"
    />

    <!-- 删除确认 -->
    <ConfirmDialog
      v-model="deleteVisible"
      :token-name="currentToken?.name"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import TokenCard from './components/TokenCard.vue';
import TokenForm from './components/TokenForm.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
import { getTokens, addToken, updateToken, deleteToken, saveTokens, getSettings, saveSettings } from './services/storage.js';
import { fetchModelsFromDataLearner, saveFetchedModels, resetToDefaultModels } from './services/modelUpdater.js';
import { getCustomModelsState } from './data/platforms.js';

const tokens = ref([]);
const searchText = ref('');
const formVisible = ref(false);
const currentToken = ref(null);
const deleteVisible = ref(false);
const fileInputRef = ref(null);
const settings = ref({ sortBy: 'updatedAt', sortOrder: 'desc' });
const updatingModels = ref(false);
const hasCustomModels = ref(false);

function checkCustomModels() {
  const state = getCustomModelsState();
  hasCustomModels.value = Object.keys(state).length > 0;
}

async function handleUpdateModels() {
  updatingModels.value = true;
  try {
    const platformMap = await fetchModelsFromDataLearner();
    const totalModels = Object.values(platformMap).reduce((sum, arr) => sum + arr.length, 0);
    await saveFetchedModels(platformMap);
    checkCustomModels();
    ElMessage.success(`模型更新成功，共 ${totalModels} 个模型`);
  } catch (e) {
    ElMessage.error('模型更新失败：' + e.message);
  } finally {
    updatingModels.value = false;
  }
}

async function handleResetModels() {
  try {
    await resetToDefaultModels();
    checkCustomModels();
    ElMessage.success('已恢复默认模型列表');
  } catch (e) {
    ElMessage.error('恢复失败：' + e.message);
  }
}

const filteredTokens = computed(() => {
  let list = [...tokens.value];
  if (searchText.value) {
    const q = searchText.value.toLowerCase();
    list = list.filter(t =>
      (t.name || '').toLowerCase().includes(q) ||
      (t.platform || '').toLowerCase().includes(q) ||
      (t.model || '').toLowerCase().includes(q) ||
      (t.baseUrl || '').toLowerCase().includes(q)
    );
  }
  // 排序
  list.sort((a, b) => {
    const aVal = a[settings.value.sortBy] || '';
    const bVal = b[settings.value.sortBy] || '';
    const cmp = String(aVal).localeCompare(String(bVal));
    return settings.value.sortOrder === 'desc' ? -cmp : cmp;
  });
  return list;
});

onMounted(async () => {
  tokens.value = await getTokens();
  settings.value = await getSettings();
  checkCustomModels();
});

watch(settings, async (val) => {
  await saveSettings(val);
}, { deep: true });

function openAddForm() {
  currentToken.value = null;
  formVisible.value = true;
}

function openEditForm(token) {
  currentToken.value = { ...token };
  formVisible.value = true;
}

function openDeleteConfirm(token) {
  currentToken.value = token;
  deleteVisible.value = true;
}

async function handleFormSubmit(formData) {
  try {
    if (currentToken.value?.id) {
      const updated = await updateToken(currentToken.value.id, formData);
      const idx = tokens.value.findIndex(t => t.id === currentToken.value.id);
      if (idx !== -1) tokens.value[idx] = updated;
      ElMessage.success('已更新');
    } else {
      const added = await addToken(formData);
      tokens.value.unshift(added);
      ElMessage.success('已添加');
    }
  } catch (e) {
    ElMessage.error('保存失败');
  }
}

async function handleDelete() {
  if (!currentToken.value) return;
  try {
    await deleteToken(currentToken.value.id);
    tokens.value = tokens.value.filter(t => t.id !== currentToken.value.id);
    ElMessage.success('已删除');
  } catch (e) {
    ElMessage.error('删除失败');
  }
}

function handleExport() {
  const data = JSON.stringify(tokens.value, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-tokens-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImport() {
  fileInputRef.value?.click();
}

async function handleFileImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    if (!Array.isArray(imported)) throw new Error('格式错误');
    await saveTokens(imported);
    tokens.value = imported;
    ElMessage.success(`导入成功 ${imported.length} 条`);
  } catch (e) {
    ElMessage.error('导入失败');
  }
  event.target.value = '';
}
</script>

<style scoped>
.options-container {
  min-height: 100vh;
  background: #f8fafc;
}

.options-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  padding: 28px 32px;
}

.options-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 4px;
}

.options-subtitle {
  font-size: 13px;
  opacity: 0.8;
}

.options-main {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 0;
  min-height: calc(100vh - 80px);
}

.panel-left {
  padding: 20px 24px;
  border-right: 1px solid #e2e8f0;
}

.panel-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  max-width: 280px;
}

.token-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
  padding-right: 4px;
}

.empty-hint {
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
  font-size: 14px;
}

.list-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  margin-top: 16px;
}

.list-footer .el-button {
  color: #64748b;
  font-size: 13px;
}

.panel-right {
  padding: 24px;
  background: #fff;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 20px;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
}

.setting-row {
  display: flex;
  gap: 8px;
}

.setting-value {
  font-size: 14px;
  color: #1e293b;
}

.about-text {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
}

.setting-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}
</style>