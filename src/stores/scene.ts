import { defineStore } from 'pinia'
import { SceneConfig } from '@/types/three'

interface SceneState {
  isLoading: boolean
  error: string | null
  config: SceneConfig | null
  isAnimationEnabled: boolean
}

export const useSceneStore = defineStore('scene', {
  state: (): SceneState => ({
    isLoading: true,
    error: null,
    config: null,
    isAnimationEnabled: true
  }),
  
  actions: {
    setLoading(status: boolean) {
      this.isLoading = status
    },
    
    setError(error: string | null) {
      this.error = error
    },
    
    setConfig(config: SceneConfig) {
      this.config = config
    },
    
    setAnimationEnabled(enabled: boolean) {
      this.isAnimationEnabled = enabled
    }
  }
}) 