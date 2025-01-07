<!-- 
ThreeScene.vue - Three.js场景渲染组件
主要职责:
1. 作为Three.js渲染的容器组件
2. 管理场景的生命周期(初始化、动画、清理)
3. 整合各个场景相关的功能模块
4. 处理场景渲染的错误状态
-->

<template>
  <!-- Three.js渲染容器,占满整个视口 -->
  <div ref="containerRef" class="three-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { inject } from 'vue'
import { ThreeSceneKey } from '@/symbols/threeScene'
import { useSceneStore } from '@/stores/scene'
import { useSceneConfig } from '@/composables/useSceneConfig'
import { useSceneEvents } from '@/composables/useSceneEvents'

// 场景容器DOM引用
const containerRef = ref<HTMLDivElement>()
// 场景状态管理
const sceneStore = useSceneStore()
// 获取场景配置
const { config } = useSceneConfig()

// 注入 three scene 实例
const threeScene = inject(ThreeSceneKey)
if (!threeScene)
  throw new Error('ThreeScene must be used within ThreeSceneProvider')

const { initScene, animate, cleanup, setAnimationEnabled } = threeScene

useSceneEvents()

// 监听 store 中的动画状态
watch(
  () => sceneStore.isAnimationEnabled,
  (newValue) => {
    setAnimationEnabled(newValue)
  }
)

onMounted(() => {
  try {
    if (containerRef.value) {
      // 初始化Three.js场景
      initScene(containerRef.value, config.value || undefined)
      // 启动渲染循环
      animate()
    }
  } catch (error) {
    // 错误处理并更新到状态管理
    sceneStore.setError(
      error instanceof Error ? error.message : 'Failed to initialize scene'
    )
  }
})

// 组件卸载前清理场景资源
onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped>
/* 场景容器样式 */
.three-container {
  width: 100%;
  height: 100vh;
}
</style>
