<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGLTF } from '@tresjs/cientos'
// import { TresGroup } from '@tresjs/core'
import { Mesh, Group } from 'three'

const emit = defineEmits<{
  assetLoaded: []
}>()

const roomGroup = ref<Group | null>(null)

// 加载房间模型
const { nodes, materials, scene } = await useGLTF(
  '/demo/room/models/Room_Portfolio.glb',
  {
    draco: true,
    onProgress: (xhr) => {
      if (xhr.loaded === xhr.total) {
        emit('assetLoaded')
      }
    }
  }
)

// 设置可交互物体
const setupInteractiveObjects = () => {
  if (!roomGroup.value) return

  // 找到可交互的物体
  const computer = roomGroup.value.getObjectByName('Computer') as Mesh
  const catPoster = roomGroup.value.getObjectByName('CatPoster') as Mesh

  if (computer) {
    computer.userData.interactive = true
    computer.userData.url = 'https://github.com/your-profile'
  }

  if (catPoster) {
    catPoster.userData.interactive = true
    catPoster.userData.action = 'togglePoster'
  }
}

onMounted(() => {
  if (roomGroup.value) {
    setupInteractiveObjects()
  }
})
</script>

<template>
  <TresGroup
    ref="roomGroup"
    :position="[0, 0, 0]"
    :rotation="[0, Math.PI, 0]"
    :scale="[1, 1, 1]"
  >
    <!-- 克隆加载的场景 -->
    <primitive :object="scene.clone()" @ready="emit('assetLoaded')" />

    <!-- 添加其他物体 -->
    <TresGroup :position="[0, 0.5, -2]" name="desk">
      <!-- 桌子上的笔记本电脑 -->
      <TresMesh
        name="Computer"
        :position="[0.5, 0.8, 0]"
        :rotation="[0, -Math.PI / 6, 0]"
        :scale="[0.5, 0.5, 0.5]"
        @click="() => window.open('https://github.com', '_blank')"
      >
        <TresBoxGeometry :args="[1, 0.05, 0.7]" />
        <TresMeshStandardMaterial color="#333333" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>
