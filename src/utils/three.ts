import { WebGLRenderer, PerspectiveCamera } from 'three'

export interface SceneConfig {
  backgroundColor: string
}

export const initRenderer = (
  container: HTMLElement,
  config?: Partial<SceneConfig>
): WebGLRenderer => {
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setClearColor(config?.backgroundColor || '#000000')
  return renderer
}

export const initCamera = (
  container: HTMLElement,
  fov = 75,
  near = 0.1,
  far = 1000
): PerspectiveCamera => {
  const camera = new PerspectiveCamera(
    fov,
    container.clientWidth / container.clientHeight,
    near,
    far
  )
  camera.position.z = 5
  return camera
} 