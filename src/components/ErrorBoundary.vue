<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<string | null>(null)

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err.message : String(err)
  return false
})

const reset = () => {
  error.value = null
}
</script>

<template>
  <div v-if="error" class="error-boundary">
    <h2>出错了</h2>
    <p>{{ error }}</p>
    <button @click="reset">重试</button>
  </div>
  <slot v-else></slot>
</template>

<style scoped>
.error-boundary {
  padding: 20px;
  text-align: center;
  color: #ff4444;
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
