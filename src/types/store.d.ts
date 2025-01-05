export interface SceneState {
  isLoading: boolean
  error: string | null
  config: import('./three').SceneConfig
}

export interface RootState {
  scene: SceneState
} 