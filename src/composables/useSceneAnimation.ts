import { ref, onBeforeUnmount } from 'vue'
import { AnimationMixer, AnimationAction, LoopOnce, Clock } from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export function useSceneAnimation() {
  const mixer = ref<AnimationMixer>()
  const actions = ref<Map<string, AnimationAction>>(new Map())
  let clock = new Clock()
  let animationFrameId: number

  const initAnimations = (gltf: GLTF) => {
    if (gltf.animations.length > 0) {
      mixer.value = new AnimationMixer(gltf.scene)
      
      gltf.animations.forEach((clip) => {
        const action = mixer.value!.clipAction(clip)
        actions.value.set(clip.name, action)
      })

      animate()
    }
  }

  const playAnimation = (name: string, options = { loop: true }) => {
    const action = actions.value.get(name)
    if (action) {
      if (!options.loop) {
        action.setLoop(LoopOnce, 1)
        action.clampWhenFinished = true
      }
      action.reset().play()
    }
  }

  const stopAnimation = (name: string) => {
    const action = actions.value.get(name)
    action?.stop()
  }

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    const delta = clock.getDelta()
    mixer.value?.update(delta)
  }

  onBeforeUnmount(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    mixer.value?.stopAllAction()
  })

  return {
    mixer,
    actions,
    initAnimations,
    playAnimation,
    stopAnimation
  }
} 