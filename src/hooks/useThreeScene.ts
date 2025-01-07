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

export function useThreeScene() {
  // 核心场景对象
  let scene: THREE.Scene // 场景实例
  let camera: THREE.PerspectiveCamera // 透视相机
  let renderer: THREE.WebGLRenderer // WebGL渲染器
  let cube: THREE.Mesh // 示例立方体
  let animationFrameId: number // 动画帧ID
  let isAnimationEnabled = true // 动画开关状态

  // 初始化场景及其组件
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
    camera.position.z = 5 // 设置相机位置

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

    // 监听窗口变化
    window.addEventListener('resize', onWindowResize)
  }

  // 动画循环
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    // 立方体旋转动画
    if (cube && isAnimationEnabled) {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
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
  }

  // 导出公共接口
  return {
    initScene, // 初始化场景
    animate, // 启动动画循环
    cleanup, // 清理资源
    getScene: () => scene, // 获取场景实例
    getCamera: () => camera, // 获取相机实例
    getRenderer: () => renderer, // 获取渲染器实例
    setAnimationEnabled // 设置动画状态
  }
}
