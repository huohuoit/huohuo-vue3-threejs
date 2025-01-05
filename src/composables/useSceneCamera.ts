import { ref, onMounted, onBeforeUnmount } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useThreeScene } from '@/hooks/useThreeScene'
import { Vector3 } from 'three'

export interface CameraConfig {
  fov: number
  near: number
  far: number
  position: Vector3
  lookAt: Vector3
}

export function useCameraConfig(initialConfig?: Partial<CameraConfig>) {
  const config = ref<CameraConfig>({
    fov: 75,
    near: 0.1,
    far: 1000,
    position: new Vector3(0, 0, 5),
    lookAt: new Vector3(0, 0, 0),
    ...initialConfig
  })
}

export function useSceneCamera() {
  let controls: OrbitControls | null = null
  let animationFrameId: number | null = null

  const { getCamera, getRenderer } = useThreeScene()

  const updateControls = () => {
    if (controls) {
      controls.update()
      animationFrameId = requestAnimationFrame(updateControls)
    }
  }

  onMounted(() => {
    const camera = getCamera()
    const renderer = getRenderer()
    
    if (camera && renderer) {
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      updateControls()
    }
  })

  onBeforeUnmount(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    if (controls) {
      controls.dispose()
    }
  })

  return {
    controls,
    updateControls
  }
} 