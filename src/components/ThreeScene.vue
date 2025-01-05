<template>
  <div ref="containerRef" class="three-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useThreeScene } from '@/hooks/useThreeScene'
import { useSceneStore } from '@/stores/scene'
import { useSceneCamera } from '@/composables/useSceneCamera'
import { useSceneConfig } from '@/composables/useSceneConfig'
import { useSceneEvents } from '@/composables/useSceneEvents'

const containerRef = ref<HTMLDivElement>()
const sceneStore = useSceneStore()
const { config } = useSceneConfig()

const { initScene, animate, cleanup } = useThreeScene()
useSceneCamera()
useSceneEvents()

onMounted(() => {
  try {
    if (containerRef.value) {
      initScene(containerRef.value, config.value || undefined)
      animate()
    }
  } catch (error) {
    sceneStore.setError(error instanceof Error ? error.message : 'Failed to initialize scene')
  }
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
}
</style> 