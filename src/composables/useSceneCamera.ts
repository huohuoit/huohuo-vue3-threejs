import { ref } from 'vue'
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
  
  return {
    config
  }
} 