import { ref, watch } from 'vue'
import { PerspectiveCamera } from 'three'
import { useThreeScene } from '@/composables/useThreeScene/index'

export interface CameraConfig {
  fov: number
  near: number
  far: number
  position: { x: number; y: number; z: number }
  lookAt: { x: number; y: number; z: number }
}

export function useCameraConfig(initialConfig?: Partial<CameraConfig>) {
  const config = ref<CameraConfig>({
    fov: 75,
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 0, z: 5 },
    lookAt: { x: 0, y: 0, z: 0 },
    ...initialConfig
  })

  const { getCamera } = useThreeScene()

  watch(config, (newConfig) => {
    const camera = getCamera()
    if (camera instanceof PerspectiveCamera) {
      camera.fov = newConfig.fov
      camera.near = newConfig.near
      camera.far = newConfig.far
      camera.position.set(
        newConfig.position.x,
        newConfig.position.y,
        newConfig.position.z
      )
      camera.lookAt(
        newConfig.lookAt.x,
        newConfig.lookAt.y,
        newConfig.lookAt.z
      )
      camera.updateProjectionMatrix()
    }
  }, { deep: true })

  return {
    config
  }
} 