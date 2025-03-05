<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useGLTF } from '@tresjs/cientos'
import { useTresContext, useRenderLoop } from '@tresjs/core'
import { Mesh, Group, Scene, Object3D } from 'three'
import { useRoomAnimation } from '../composables/useRoomAnimation'

const emit = defineEmits<{
  (e: 'assetLoaded'): void
}>()

const { scene: tresScene, renderer } = useTresContext()
const roomGroup = ref<Group | null>(null)
const gltfScene = ref<Scene>()
const interactiveObjects = ref<Mesh[]>([])
let animateRoom: (() => void) | null = null

// 加载房间模型
const loadModel = async () => {
  try {
    const { scene } = await useGLTF('/models/Room_Portfolio.glb', {
      draco: true,
      decoderPath: '/draco/'
    })

    // 强制更新场景矩阵
    scene.traverse((obj) => {
      if (obj instanceof Object3D) {
        obj.updateMatrixWorld(true)
      }
    })

    if (tresScene?.value) {
      tresScene.value.add(scene)
      scene.traverse((obj) => obj.updateMatrixWorld(true))
    }

    // 保存场景引用
    gltfScene.value = scene

    // 初始化动画
    const { initFloatingObjects, animateRoom: animate } =
      useRoomAnimation(scene)
    initFloatingObjects()
    animateRoom = animate

    emit('assetLoaded')
  } catch (error) {
    console.error('模型加载失败:', error)
  }
}

// 递归查找对象
const findObjectRecursive = (name: string, group: Group): Mesh | undefined => {
  let target: Mesh | undefined
  group.traverse((child: Object3D) => {
    console.log(`${child.name} 矩阵状态:`, child.matrixWorld)
    if (child.name === name && child instanceof Mesh) {
      target = child
    }
  })
  return target
}

// 设置可交互物体
const setupInteractiveObjects = () => {
  if (!roomGroup.value) return

  // 查找GLTF模型中的对象
  const gltfComputer = findObjectRecursive('Computer', roomGroup.value)
  const gltfCatPoster = findObjectRecursive('CatPoster', roomGroup.value)

  // 查找手动添加的对象
  const customComputer = findObjectRecursive('CustomComputer', roomGroup.value)

  // 统一处理交互属性
  ;[gltfComputer, customComputer].forEach((obj) => {
    if (obj) {
      obj.userData.interactive = true
      obj.userData.url = 'https://github.com/your-profile'
      interactiveObjects.value.push(obj)
    }
  })

  if (gltfCatPoster) {
    gltfCatPoster.userData.interactive = true
    gltfCatPoster.userData.action = 'togglePoster'
    interactiveObjects.value.push(gltfCatPoster)
  }
}

const openWindow = (url: string) => {
  window.open(url, '_blank')
}

const { onLoop } = useRenderLoop()
onLoop(() => {
  if (animateRoom) {
    animateRoom()
  }
})

onMounted(() => {
  if (renderer.value) {
    loadModel()
  }
  nextTick(setupInteractiveObjects)
})

onUnmounted(() => {
  animateRoom = null
  // 清理交互对象引用
  interactiveObjects.value.forEach((obj) => {
    delete obj.userData.interactive
    delete obj.userData.url
    delete obj.userData.action
  })

  // 清理场景
  if (gltfScene.value && roomGroup.value) {
    roomGroup.value.remove(gltfScene.value)
    gltfScene.value.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry?.dispose()
        child.material?.dispose()
      }
    })
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
    <!-- 加载的GLTF场景 -->
    <primitive v-if="gltfScene?.isScene" :object="gltfScene" />

    <!-- 自定义添加内容 -->
    <TresGroup :position="[0, 0.5, -2]" name="desk">
      <TresMesh
        name="CustomComputer"
        :position="[0.5, 0.8, 0]"
        :rotation="[0, -Math.PI / 6, 0]"
        :scale="[0.5, 0.5, 0.5]"
        @click="() => openWindow('https://github.com')"
      >
        <TresBoxGeometry :args="[1, 0.05, 0.7]" />
        <TresMeshStandardMaterial color="#333333" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>
