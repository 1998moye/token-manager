<template>
  <div class="app">
    <!-- 顶部 Header -->
    <div class="app-header">
      <div class="header-left">
        <h1 class="app-title">Token 管理器</h1>
        <span class="token-count" v-if="tokens.length">{{ tokens.length }} 个</span>
      </div>
      <div class="header-right">
        <el-button
          text
          size="small"
          :loading="updatingModels"
          @click="handleUpdateModels"
          title="更新模型列表"
          class="refresh-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </el-button>
        <el-input
          v-model="searchText"
          placeholder="搜索..."
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
        <el-button type="primary" size="default" @click="openAddForm" class="add-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right:4px">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          添加
        </el-button>
      </div>
    </div>

    <!-- Token 列表 -->
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

      <!-- 空状态 -->
      <div v-else-if="!searchText" class="empty-state">
        <div class="empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <p class="empty-title">还没有 Token</p>
        <p class="empty-desc">点击上方「添加」按钮来添加你的第一个 Token</p>
        <el-button type="primary" @click="openAddForm" size="default">添加 Token</el-button>
      </div>

      <!-- 搜索无结果 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <p class="empty-title">未找到匹配项</p>
        <p class="empty-desc">换个关键词试试</p>
      </div>
    </div>

    <!-- 底部工具栏 -->
    <div class="app-footer">
      <el-button text size="small" @click="handleImport">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17,8 12,3 7,8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        导入
      </el-button>
      <el-button text size="small" @click="handleExport" :disabled="!tokens.length">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        导出
      </el-button>
    </div>

    <!-- 隐藏的文件输入 -->
    <input type="file" ref="fileInputRef" accept=".json" style="display:none" @change="handleFileImport" />

    <!-- 表单弹窗（右侧抽屉） -->
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
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import TokenCard from './components/TokenCard.vue';
import TokenForm from './components/TokenForm.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
import { getTokens, addToken, updateToken, deleteToken, saveTokens } from './services/storage.js';
import { fetchModelsFromDataLearner, saveFetchedModels } from './services/modelUpdater.js';

const tokens = ref([]);
const searchText = ref('');
const formVisible = ref(false);
const currentToken = ref(null);
const deleteVisible = ref(false);
const fileInputRef = ref(null);
const updatingModels = ref(false);

async function handleUpdateModels() {
  updatingModels.value = true;
  try {
    const platformMap = await fetchModelsFromDataLearner();
    const totalModels = Object.values(platformMap).reduce((sum, arr) => sum + arr.length, 0);
    await saveFetchedModels(platformMap);
    ElMessage.success(`模型更新成功，共 ${totalModels} 个`);
  } catch (e) {
    ElMessage.error('模型更新失败：' + e.message);
  } finally {
    updatingModels.value = false;
  }
}

const filteredTokens = computed(() => {
  if (!searchText.value) return tokens.value;
  const q = searchText.value.toLowerCase();
  return tokens.value.filter(t =>
    (t.name || '').toLowerCase().includes(q) ||
    (t.platform || '').toLowerCase().includes(q) ||
    (t.model || '').toLowerCase().includes(q) ||
    (t.baseUrl || '').toLowerCase().includes(q)
  );
});

onMounted(async () => {
  tokens.value = await getTokens();
});

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
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

.app-header {
  padding: 16px 16px 12px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.3px;
}

.token-count {
  font-size: 12px;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 10px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: 140px;
}

.add-btn {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.refresh-btn {
  padding: 6px 8px;
  color: #94a3b8;
}
.refresh-btn:hover {
  color: #3b82f6;
}

.token-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #94a3b8;
  text-align: center;
  padding: 40px 0;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  color: #cbd5e1;
}

.empty-title {
  font-size: 15px;
  font-weight: 600;
  color: #475569;
}

.empty-desc {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.app-footer {
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-shrink: 0;
}

.app-footer .el-button {
  color: #64748b;
  font-size: 13px;
  display: flex;
  align-items: center;
}
</style>