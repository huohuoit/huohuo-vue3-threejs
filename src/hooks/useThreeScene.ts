import * as THREE from 'three'
import { AmbientLight, DirectionalLight } from 'three'
import { SceneConfig } from '@/types/three'

export function useThreeScene() {
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let cube: THREE.Mesh
  let animationFrameId: number
  let isAnimationEnabled = true

  const initScene = (container: HTMLElement, config?: SceneConfig) => {
    scene = new THREE.Scene()
    if (config?.backgroundColor) {
      scene.background = new THREE.Color(config.backgroundColor)
    }

    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const ambientLight = new AmbientLight(
      config?.ambientLightColor || 0xffffff,
      config?.ambientLightIntensity || 0.5
    )
    scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    window.addEventListener('resize', onWindowResize)
  }

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    
    if (cube && isAnimationEnabled) {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
    }

    renderer.render(scene, camera)
  }

  const onWindowResize = () => {
    if (camera && renderer && renderer.domElement) {
      const container = renderer.domElement.parentElement
      if (container) {
        camera.aspect = container.clientWidth / container.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(container.clientWidth, container.clientHeight)
      }
    }
  }

  const cleanup = () => {
    window.removeEventListener('resize', onWindowResize)
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
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

  const setAnimationEnabled = (enabled: boolean) => {
    isAnimationEnabled = enabled
  }

  return {
    initScene,
    animate,
    cleanup,
    getScene: () => scene,
    getCamera: () => camera,
    getRenderer: () => renderer,
    setAnimationEnabled
  }
} 