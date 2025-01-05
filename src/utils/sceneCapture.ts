import { WebGLRenderer } from 'three'

export const captureScene = (renderer: WebGLRenderer): Promise<Blob> => {
  return new Promise((resolve) => {
    renderer.domElement.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      }
    }, 'image/png')
  })
}

export const downloadSceneCapture = async (renderer: WebGLRenderer, filename = 'scene.png') => {
  const blob = await captureScene(renderer)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
} 