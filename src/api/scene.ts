import { SceneConfig } from '@/types/three'

export const getSceneConfig = async (): Promise<SceneConfig> => {
  // 模拟 API 调用
  return {
    backgroundColor: '#000000',
    ambientLightColor: '#ffffff',
    ambientLightIntensity: 0.5
  }
} 