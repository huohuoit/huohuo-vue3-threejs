export interface SceneSettings {
  antialias: boolean
  shadows: boolean
  pixelRatio: number
  backgroundColor: string
}

export interface LightSettings {
  ambient: {
    color: string
    intensity: number
  }
  directional: {
    color: string
    intensity: number
    position: { x: number; y: number; z: number }
  }
}

export interface SceneConfiguration {
  scene: SceneSettings
  lights: LightSettings
  camera: import('./camera').CameraConfig
} 