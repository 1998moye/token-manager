<template>
  <el-dialog
    v-model="visible"
    title="确认删除"
    width="340px"
    align-center
    class="confirm-dialog"
  >
    <div class="dialog-content">
      <div class="warning-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <p class="dialog-text">
        确定要删除 Token「<strong>{{ tokenName }}</strong>」吗？
      </p>
      <p class="dialog-hint">此操作不可撤销</p>
    </div>
    <template #footer>
      <el-button @click="visible = false" size="default">取消</el-button>
      <el-button type="danger" @click="handleConfirm" size="default">删除</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  tokenName: { type: String, default: '' }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const visible = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
});

function handleConfirm() {
  emit('confirm');
  visible.value = false;
}
</script>

<style scoped>
.dialog-content {
  text-align: center;
  padding: 8px 0 4px;
}

.warning-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: #ef4444;
}

.dialog-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 4px;
}

.dialog-text strong {
  color: #111827;
}

.dialog-hint {
  font-size: 12px;
  color: #9ca3af;
}
</style>
