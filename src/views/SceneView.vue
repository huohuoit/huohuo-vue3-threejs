<template>
  <div class="scene-view">
    <ErrorBoundary>
      <SceneStats v-if="isDev" />
      <SceneLoader />
      <ThreeScene />
      <SceneControls />
    </ErrorBoundary>
  </div>
</template>

<script setup lang="ts">
import ThreeScene from '@/components/ThreeScene.vue'
import SceneControls from '@/components/SceneControls.vue'
import SceneLoader from '@/components/SceneLoader.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import SceneStats from '@/components/SceneStats.vue'

// 在 setup 中定义环境变量
const isDev = import.meta.env.DEV;
</script>

<style scoped>
.scene-view {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style> 