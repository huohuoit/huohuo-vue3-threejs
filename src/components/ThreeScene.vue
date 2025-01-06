<template>
  <div ref="containerRef" class="three-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { inject } from 'vue'
import { ThreeSceneKey } from '@/symbols/threeScene'
import { useSceneStore } from '@/stores/scene'
import { useSceneConfig } from '@/composables/useSceneConfig'
import { useSceneEvents } from '@/composables/useSceneEvents'

const containerRef = ref<HTMLDivElement>()
const sceneStore = useSceneStore()
const { config } = useSceneConfig()

// 注入 three scene 实例
const threeScene = inject(ThreeSceneKey)
if (!threeScene) throw new Error('ThreeScene must be used within ThreeSceneProvider')

const { initScene, animate, cleanup, setAnimationEnabled } = threeScene

useSceneEvents()

// 监听 store 中的动画状态
watch(() => sceneStore.isAnimationEnabled, (newValue) => {
  setAnimationEnabled(newValue)
})

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