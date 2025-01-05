<template>
  <div class="scene-controls">
    <button @click="resetCamera">重置视角</button>
    <button @click="toggleRotation">{{ isRotating ? '停止旋转' : '开始旋转' }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThreeScene } from '@/hooks/useThreeScene'
import { useSceneStore } from '@/stores/scene'

const isRotating = ref(true)
const { getCamera, setAnimationEnabled } = useThreeScene()
const sceneStore = useSceneStore()

const resetCamera = () => {
  const camera = getCamera()
  if (camera) {
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
    sceneStore.setLoading(false)
  }
}

const toggleRotation = () => {
  isRotating.value = !isRotating.value
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