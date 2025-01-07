import { onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { useThreeScene } from '@/composables/useThreeScene/index'
import type { Intersection } from 'three'

export interface InteractionEvents {
  onClick?: (intersect: Intersection) => void
  onHover?: (intersect: Intersection) => void
  onLeave?: () => void
}

export const useSceneEvents = () => {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  
  const { getScene, getCamera, getRenderer } = useThreeScene()

  const onMouseMove = (event: MouseEvent) => {
    const renderer = getRenderer()
    if (!renderer) return

    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const camera = getCamera()
    const scene = getScene()
    
    if (camera && scene) {
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children)

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.material.color.setHex(0x00ff00)
        }
      })

      for (const intersect of intersects) {
        if (intersect.object instanceof THREE.Mesh) {
          intersect.object.material.color.setHex(0xff0000)
        }
      }
    }
  }

  onMounted(() => {
    const renderer = getRenderer()
    renderer?.domElement.addEventListener('mousemove', onMouseMove)
  })

  onBeforeUnmount(() => {
    const renderer = getRenderer()
    renderer?.domElement.removeEventListener('mousemove', onMouseMove)
  })
} 