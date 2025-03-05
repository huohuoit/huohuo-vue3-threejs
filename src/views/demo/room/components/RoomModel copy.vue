<!-- <script setup lang="ts">
import { ref, watchEffect, onUnmounted } from 'vue'
import { useTresContext } from '@tresjs/core'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Mesh, Group, Scene, LoadingManager, type Object3D } from 'three'

const emit = defineEmits<{
  (e: 'assetProgress', progress: number): void
  (e: 'assetLoaded'): void
  (e: 'loadError', error: Error): void
}>()

const { scene: tresScene } = useTresContext()
const roomGroup = ref<Group | null>(null)
const gltfScene = ref<Scene>()
const nodes = ref<Record<string, Object3D>>({})
const materials = ref<Record<string, any>>({})

// 创建加载管理器
const createLoadingManager = () => {
  let loadedItems = 0
  let totalItems = 0

  return new LoadingManager(
    () => emit('assetLoaded'),
    (url, loaded, total) => {
      loadedItems = loaded
      totalItems = total
      emit('assetProgress', loaded / total)
    },
    (error) => emit('loadError', error)
  )
}

// 加载GLTF模型
const loadModel = async () => {
  try {
    const manager = createLoadingManager()
    const loader = new GLTFLoader(manager)

    // 配置DRACO解码器
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)

    const gltf = await loader.loadAsync(
      '/demo/room/assets/models/Room_Portfolio.glb'
    )

    // 保留原始数据引用
    nodes.value = gltf.nodes
    materials.value = gltf.materials
    gltfScene.value = gltf.scene

    // 将场景添加到Tres上下文
    if (tresScene && gltfScene.value) {
      tresScene.add(gltfScene.value)
    }
  } catch (error) {
    emit('loadError', error as Error)
  }
}

// 设置交互对象
const setupInteractiveObjects = () => {
  if (!roomGroup.value) return

  const findObject = (name: string): Mesh | undefined => {
    let target: Mesh | undefined
    roomGroup.value!.traverse((child) => {
      if (child.name === name && child instanceof Mesh) {
        target = child
      }
    })
    return target
  }

  // 处理原始模型中的对象
  const computer = findObject('Computer')
  const catPoster = findObject('CatPoster')

  // 处理手动添加的对象
  const customComputer = findObject('CustomComputer')

  // 统一设置交互属性
  ;[computer, customComputer].forEach((obj) => {
    if (obj) {
      obj.userData.interactive = true
      obj.userData.url = 'https://github.com/your-profile'
    }
  })

  if (catPoster) {
    catPoster.userData.interactive = true
    catPoster.userData.action = 'togglePoster'
  }
}

// 初始化加载
loadModel()

// 响应式设置交互
watchEffect(() => {
  if (roomGroup.value && gltfScene.value) {
    setupInteractiveObjects()
  }
})

// 清理资源
onUnmounted(() => {
  if (gltfScene.value && tresScene) {
    tresScene.remove(gltfScene.value)
    gltfScene.value.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry?.dispose()
        child.material?.dispose()
      }
    })
  }
})

const openWindow = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <TresGroup
    ref="roomGroup"
    :position="[0, 0, 0]"
    :rotation="[0, Math.PI, 0]"
    :scale="[1, 1, 1]"
  >
    <!-- 原始模型场景 -->
    <primitive v-if="gltfScene" :object="gltfScene" />

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
</template> -->
