<script setup lang="ts">
import { onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { ThreeSceneKey } from '@/symbols/threeScene'
import { useSceneStore } from '@/stores/scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useSceneEvents } from '@/composables/useSceneEvents/index'
import * as THREE from 'three'

const sceneStore = useSceneStore()

const threeScene = inject(ThreeSceneKey)
if (!threeScene)
  throw new Error('ThreeScene must be used within ThreeSceneProvider')

const { setAnimationEnabled } = threeScene

useSceneEvents()

// 监听 store 中的动画状态
watch(
  () => sceneStore.isAnimationEnabled,
  (newValue) => {
    setAnimationEnabled(newValue)
  }
)

onMounted(async () => {
  const container = document.querySelector('.model-viewer')
  if (!container) {
    throw new Error('Container element not found')
  }

  // 初始化场景
  threeScene.initScene(container as HTMLElement)

  const scene = threeScene.getScene()
  if (!scene) {
    console.error('Scene is undefined')
    return
  }

  // 调整相机位置 - 基于模型实际大小
  const camera = threeScene.getCamera()
  if (camera) {
    camera.position.set(0, 20, 50) // 更远的视角
    camera.lookAt(0, 0, 0)
  }

  const loader = new GLTFLoader()

  try {
    sceneStore.setLoading(true)
    const gltf = await loader.loadAsync('/215xin.glb')

    const model = gltf.scene
    console.log(`output->model`, model)

    // 计算模型中心点和尺寸
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    // 计算合适的缩放比例 - 调整为更小的尺寸
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 10 / maxDim // 将最大尺寸缩放到10个单位

    // 调整模型
    model.scale.setScalar(scale)
    model.position.copy(center).multiplyScalar(-scale) // 居中放置

    // 确保模型在地面上
    const boundingBox = new THREE.Box3().setFromObject(model)
    const modelHeight = boundingBox.max.y - boundingBox.min.y
    model.position.y = (modelHeight * scale) / 2

    // 遍历模型设置材质属性
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true

        // 如果材质是数组
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.side = THREE.DoubleSide // 双面渲染
          })
        } else {
          child.material.side = THREE.DoubleSide
        }
      }
    })

    // 增强光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(20, 20, 20)
    directionalLight.castShadow = true

    // 调整阴影相机参数
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 100
    directionalLight.shadow.camera.left = -20
    directionalLight.shadow.camera.right = 20
    directionalLight.shadow.camera.top = 20
    directionalLight.shadow.camera.bottom = -20

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(-20, 20, -20)

    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)
    scene.add(model)

    // 添加辅助工具 - 扩大范围
    const axesHelper = new THREE.AxesHelper(20)
    scene.add(axesHelper)

    const gridHelper = new THREE.GridHelper(40, 40)
    scene.add(gridHelper)

    // 打印调试信息
    console.log('Model size:', size)
    console.log('Model center:', center)
    console.log('Applied scale:', scale)
    console.log('Final model position:', model.position)

    // 启动动画循环
    threeScene.animate()

    sceneStore.setLoading(false)
  } catch (error) {
    console.error('加载模型时出错:', error)
    sceneStore.setLoading(false)
  }
})

onBeforeUnmount(() => {
  threeScene.cleanup()
})
</script>

<template>
  <div class="model-viewer"></div>
</template>
