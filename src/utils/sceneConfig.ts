import { SceneConfig } from '@/types/three'

export const DEFAULT_SCENE_CONFIG: SceneConfig = {
  backgroundColor: '#000000',
  ambientLightColor: '#ffffff',
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