<template>
  <div class="token-card">
    <!-- 左侧彩色条 + 平台图标 -->
    <div class="card-left">
      <div class="platform-badge" :style="{ background: platformInfo.color }">
        {{ platformInfo.logo }}
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="card-body">
      <div class="card-top">
        <div class="card-info">
          <div class="token-name">{{ token.name }}</div>
          <div class="token-model text-muted text-sm">{{ token.model }}</div>
        </div>
        <div class="card-actions">
          <el-button text size="small" circle title="复制完整配置（用于 ccswitch）" @click="handleCopyConfig">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </el-button>
          <el-button text size="small" circle title="编辑" @click="$emit('edit', token)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </el-button>
          <el-button text size="small" circle type="danger" title="删除" @click="$emit('delete', token)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1 2-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
          </el-button>
        </div>
      </div>

      <!-- API 地址 -->
      <div class="token-url-row" :title="token.baseUrl">
        <span class="token-url font-mono text-sm">{{ token.baseUrl }}</span>
        <el-button text size="small" @click="handleCopyUrl" class="row-copy-btn" title="复制 API 地址">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </el-button>
      </div>

      <!-- API Key -->
      <div class="token-key-row">
        <span class="token-key font-mono text-sm">
          {{ showKey ? token.apiKey : maskedKey }}
        </span>
        <el-button text size="small" @click="toggleKey" class="toggle-key-btn" title="显示/隐藏">
          <svg v-if="!showKey" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        </el-button>
        <el-button text size="small" @click="handleCopyKey" class="row-copy-btn" title="复制 API Key">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        </el-button>
      </div>

      <!-- 备注 -->
      <div class="token-remark text-muted text-sm" v-if="token.remark">{{ token.remark }}</div>
    </div>

    <!-- 复制成功提示 -->
    <transition name="fade">
      <div v-if="copySuccess" class="copy-toast">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        {{ copyMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getPlatform, maskApiKey } from '../data/platforms.js';
import { copyToClipboard, copyTokenConfig } from '../services/clipboard.js';

const props = defineProps({
  token: { type: Object, required: true }
});

const emit = defineEmits(['edit', 'delete']);

const showKey = ref(false);
const copySuccess = ref(false);
const copyMessage = ref('');
let toastTimer = null;

const platformInfo = computed(() => {
  const p = getPlatform(props.token.platform);
  return p || { id: props.token.platform, name: props.token.platform, color: '#3b82f6', logo: props.token.platform[0].toUpperCase() };
});

const maskedKey = computed(() => maskApiKey(props.token.apiKey));

function toggleKey() {
  showKey.value = !showKey.value;
}

function showToast(message) {
  copyMessage.value = message;
  copySuccess.value = true;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { copySuccess.value = false; }, 2000);
}

async function handleCopyConfig() {
  const result = await copyTokenConfig(props.token, platformInfo.value.name);
  if (result.success) showToast('已复制配置');
}

async function handleCopyUrl() {
  const result = await copyToClipboard(props.token.baseUrl);
  if (result.success) showToast('已复制 API 地址');
}

async function handleCopyKey() {
  const result = await copyToClipboard(props.token.apiKey);
  if (result.success) showToast('已复制 Key');
}
</script>

<style scoped>
.token-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 0;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
  position: relative;
  flex-shrink: 0;
}

.token-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e1;
}

.card-left {
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.card-left::after {
  content: '';
  position: absolute;
  right: 0;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: #f1f5f9;
}

.platform-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: -0.5px;
}

.card-body {
  flex: 1;
  padding: 14px 14px 14px 12px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.card-info {
  min-width: 0;
  flex: 1;
}

.token-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.token-model {
  margin-top: 2px;
}

.token-url-row,
.token-key-row {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border-radius: 6px;
  padding: 6px 8px;
  margin-top: 2px;
}

.token-url,
.token-key {
  flex: 1;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}

.toggle-key-btn,
.row-copy-btn {
  flex-shrink: 0;
  padding: 4px !important;
  color: #94a3b8 !important;
}

.toggle-key-btn:hover,
.row-copy-btn:hover {
  color: #3b82f6 !important;
}

.card-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.token-remark {
  margin-top: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 复制成功提示 */
.copy-toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.copy-toast svg {
  color: #4ade80;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}
</style>
