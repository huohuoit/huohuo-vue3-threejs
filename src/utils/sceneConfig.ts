import { SceneConfig } from '@/types/three'

export const DEFAULT_SCENE_CONFIG: SceneConfig = {
  backgroundColor: 0x000000,
  ambientLightColor: 0xffffff,
  ambientLightIntensity: 0.5
}

export const mergeSceneConfig = (
  config?: Partial<SceneConfig>
): SceneConfig => {
  return {
    ...DEFAULT_SCENE_CONFIG,
    ...config
  }
} 