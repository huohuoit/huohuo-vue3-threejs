import { defineStore } from 'pinia'
import { SceneConfig } from '@/types/three'

interface SceneState {
  isLoading: boolean
  error: string | null
  config: SceneConfig | null
}

export const useSceneStore = defineStore('scene', {
  state: (): SceneState => ({
    isLoading: false,
    error: null,
    config: null
  }),
  
  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading
    },
    
    setError(error: string | null) {
      this.error = error
    },
    
    setConfig(config: SceneConfig) {
      this.config = config
    }
  }
}) 