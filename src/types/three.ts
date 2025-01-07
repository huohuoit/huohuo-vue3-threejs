import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { Ref } from 'vue'
import type { Scene, PerspectiveCamera, WebGLRenderer } from 'three'

export interface SceneConfig {
  backgroundColor?: string | number
  ambientLightColor?: number
  ambientLightIntensity?: number
}

export interface ThreeSceneContext {
  initScene: (container: HTMLElement, config?: SceneConfig) => void
  animate: () => void
  cleanup: () => void
  getScene: () => Scene
  getCamera: () => PerspectiveCamera
  getRenderer: () => WebGLRenderer
  setAnimationEnabled: (enabled: boolean) => void
  controls: Ref<OrbitControls | null>
  resetCamera: () => void
} 