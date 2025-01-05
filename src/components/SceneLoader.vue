<template>
  <div v-if="sceneStore.isLoading" class="scene-loader">
    <div class="loader"></div>
    <p>加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { useSceneStore } from '@/stores/scene'

const sceneStore = useSceneStore()
</script>

<style scoped>
.scene-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--primary-color);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> 