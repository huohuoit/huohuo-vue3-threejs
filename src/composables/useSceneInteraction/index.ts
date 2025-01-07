import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { useThreeScene } from '@/composables/useThreeScene/index'
import type { Intersection } from 'three'

export interface InteractionEvents {
  onClick?: (intersect: Intersection) => void
  onHover?: (intersect: Intersection) => void
  onLeave?: () => void
}

export function useSceneInteraction(events?: InteractionEvents) {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const hoveredObject = ref<THREE.Object3D | null>(null)

  const { getScene, getCamera, getRenderer } = useThreeScene()

  const onMouseMove = (event: MouseEvent) => {
    const renderer = getRenderer()
    if (!renderer) return

    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    checkIntersection()
  }

  const onClick = () => {
    const intersects = getIntersects()
    if (intersects.length > 0 && events?.onClick) {
      events.onClick(intersects[0])
    }
  }

  const checkIntersection = () => {
    const intersects = getIntersects()
    
    if (intersects.length > 0) {
      const intersected = intersects[0].object
      if (hoveredObject.value !== intersected) {
        if (hoveredObject.value && events?.onLeave) {
          events.onLeave()
        }
        hoveredObject.value = intersected
        if (events?.onHover) {
          events.onHover(intersects[0])
        }
      }
    } else if (hoveredObject.value) {
      if (events?.onLeave) {
        events.onLeave()
      }
      hoveredObject.value = null
    }
  }

  const getIntersects = () => {
    const camera = getCamera()
    const scene = getScene()
    
    if (!camera || !scene) return []

    raycaster.setFromCamera(mouse, camera)
    return raycaster.intersectObjects(scene.children, true)
  }

  onMounted(() => {
    const renderer = getRenderer()
    if (renderer) {
      renderer.domElement.addEventListener('mousemove', onMouseMove)
      renderer.domElement.addEventListener('click', onClick)
    }
  })

  onBeforeUnmount(() => {
    const renderer = getRenderer()
    if (renderer) {
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('click', onClick)
    }
  })

  return {
    hoveredObject,
    raycaster
  }
} 