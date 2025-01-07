<!-- 
SceneControls.vue - Three.js场景控制组件，提供重置相机和控制模型旋转的功能
组件主要功能:
- 重置相机视角按钮
- 控制模型旋转的开关按钮
关键依赖:
- useThreeScene: 自定义hook，用于操作Three.js场景
- useSceneStore: Pinia状态管理，控制场景相关状态
-->
<template>
  <div class="scene-controls">
    <button @click="handleResetCamera">重置视角</button>
    <button @click="toggleRotation">
      {{ isRotating ? '停止旋转' : '开始旋转' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { inject } from 'vue'
import { ThreeSceneKey } from '@/symbols/threeScene'
import { useSceneStore } from '@/stores/scene'

const sceneStore = useSceneStore()

// 注入 three scene 实例
const threeScene = inject(ThreeSceneKey)
if (!threeScene)
  throw new Error('SceneControls must be used within ThreeSceneProvider')

const { resetCamera: resetCameraFn, setAnimationEnabled } = threeScene
const isRotating = ref(sceneStore.isAnimationEnabled)

onMounted(() => {
  setAnimationEnabled(isRotating.value)
})

const handleResetCamera = () => {
  console.log('Reset camera clicked')
  resetCameraFn()
}

const toggleRotation = () => {
  isRotating.value = !isRotating.value
  sceneStore.setAnimationEnabled(isRotating.value)
  setAnimationEnabled(isRotating.value)
}
</script>

<style scoped>
.scene-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>
