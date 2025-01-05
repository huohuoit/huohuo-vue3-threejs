import { Object3D } from 'three'

export interface SceneObject extends Object3D {
  id: string
  name: string
}

export interface SceneConfig {
  backgroundColor?: string
  ambientLightColor?: string
  ambientLightIntensity?: number
  directionalLightColor?: string
  directionalLightIntensity?: number
  directionalLightPosition?: {
    x: number
    y: number
    z: number
  }
} 