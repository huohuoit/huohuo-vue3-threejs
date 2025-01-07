// useThreeScene.ts - Three.js场景管理Hook
// 主要职责:
// 1. 初始化和管理Three.js场景、相机、渲染器等核心对象
// 2. 处理场景动画和渲染循环
// 3. 提供场景清理和资源释放功能
// 4. 响应窗口大小变化
// 5. 提供场景操作的公共接口

import * as THREE from 'three'
import { AmbientLight, DirectionalLight } from 'three'
import { SceneConfig } from '@/types/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ref } from 'vue'
import { useSceneStore } from '@/stores/scene'

// 添加单例存储
let threeSceneInstance: ReturnType<typeof createThreeScene> | null = null

// 重命名原函数为 createThreeScene
const createThreeScene = () => {
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let cube: THREE.Mesh
  let animationFrameId: number
  let isAnimationEnabled = true

  const controls = ref<OrbitControls | null>(null)
  const sceneStore = useSceneStore()

  let initialCameraPosition: THREE.Vector3
  let initialCameraRotation: THREE.Euler

  const initScene = (container: HTMLElement, config?: SceneConfig) => {
    // 创建场景
    scene = new THREE.Scene()
    if (config?.backgroundColor) {
      scene.background = new THREE.Color(config.backgroundColor)
    }

    // 设置相机
    camera = new THREE.PerspectiveCamera(
      75, // 视野角度
      container.clientWidth / container.clientHeight, // 宽高比
      0.1, // 近裁面
      1000 // 远裁面
    )
    
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)
    initialCameraPosition = camera.position.clone()
    initialCameraRotation = camera.rotation.clone()

    // 初始化渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true }) // 开启抗锯齿
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // 添加环境光
    const ambientLight = new AmbientLight(
      config?.ambientLightColor || 0xffffff, // 默认白色
      config?.ambientLightIntensity || 0.5 // 默认强度0.5
    )
    scene.add(ambientLight)

    // 添加平行光
    const directionalLight = new DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5) // 光源位置
    scene.add(directionalLight)

    // 创建示例立方体
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // 修改 controls 初始化
    controls.value = new OrbitControls(camera, renderer.domElement)
    controls.value.enableDamping = true
    controls.value.dampingFactor = 0.05
    controls.value.autoRotate = sceneStore.isAnimationEnabled
    controls.value.autoRotateSpeed = 2.0
    controls.value.minDistance = 3
    controls.value.maxDistance = 10
    controls.value.enablePan = false
    
    // 确保 controls 初始状态正确
    controls.value.target.set(0, 0, 0)
    controls.value.update()

    isAnimationEnabled = sceneStore.isAnimationEnabled
    window.addEventListener('resize', onWindowResize)
  }

  // 动画循环
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    
    if (controls.value) {
      controls.value.update() // 始终更新 controls，不需要检查 isAnimationEnabled
    }

    renderer.render(scene, camera) // 渲染场景
  }

  // 响应窗口大小变化
  const onWindowResize = () => {
    if (camera && renderer && renderer.domElement) {
      const container = renderer.domElement.parentElement
      if (container) {
        // 更新相机和渲染器尺寸
        camera.aspect = container.clientWidth / container.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(container.clientWidth, container.clientHeight)
      }
    }
  }

  // 清理场景资源
  const cleanup = () => {
    window.removeEventListener('resize', onWindowResize)
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    // 遍历场景中所有对象并释放资源
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
    renderer?.dispose()
  }

  // 控制动画状态
  const setAnimationEnabled = (enabled: boolean) => {
    isAnimationEnabled = enabled
    if (controls.value) {
      controls.value.autoRotate = enabled
      if (!enabled) {
        controls.value.update()
      }
    }
  }

  const getCamera = () => {
    return camera
  }

  const resetCamera = () => {
    console.log('resetCamera called', {
      hasCamera: !!camera,
      hasControls: !!controls.value,
      cameraPosition: camera?.position,
      controlsTarget: controls.value?.target
    })
    
    if (camera && controls.value) {
      // 1. 先停止自动旋转
      const wasAutoRotate = controls.value.autoRotate
      controls.value.autoRotate = false
      
      // 2. 完全销毁当前的 controls
      controls.value.dispose()
      controls.value = null
      
      // 3. 重置相机到初始状态
      camera.position.copy(initialCameraPosition)
      camera.rotation.copy(initialCameraRotation)
      
      // 4. 创建新的 controls 实例
      controls.value = new OrbitControls(camera, renderer.domElement)
      
      // 5. 设置 controls 的基本属性
      controls.value.enableDamping = true
      controls.value.dampingFactor = 0.05
      controls.value.minDistance = 3
      controls.value.maxDistance = 10
      controls.value.enablePan = false
      
      // 6. 重置 controls 的目标点和更新
      controls.value.target.set(0, 0, 0)
      controls.value.update()
      
      // 7. 确保相机朝向正确
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
      
      // 8. 恢复自动旋转状态
      controls.value.autoRotate = wasAutoRotate
      controls.value.autoRotateSpeed = 2.0
      
      // 9. 重置物体
      if (cube) {
        cube.rotation.set(0, 0, 0)
      }
      
      // 10. 强制渲染更新
      renderer.render(scene, camera)
    } else {
      console.warn('Missing camera or controls')
    }
  }

  // 导出公共接口
  return {
    initScene,
    animate,
    cleanup,
    getScene: () => scene,
    getCamera,
    getRenderer: () => renderer,
    setAnimationEnabled,
    controls,
    resetCamera,
  }
}

// 导出单例版本的 useThreeScene
export const useThreeScene = () => {
  if (!threeSceneInstance) {
    threeSceneInstance = createThreeScene()
  }
  return threeSceneInstance
} 
