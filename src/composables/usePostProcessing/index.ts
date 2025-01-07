import { ref, onMounted, onBeforeUnmount } from 'vue'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { useThreeScene } from '@/composables/useThreeScene/index'
import { Vector2 } from 'three'

export function usePostProcessing() {
  const composer = ref<EffectComposer>()
  let animationId: number

  const { getScene, getCamera, getRenderer } = useThreeScene()

  const initPostProcessing = () => {
    const scene = getScene()
    const camera = getCamera()
    const renderer = getRenderer()

    if (!scene || !camera || !renderer) return

    composer.value = new EffectComposer(renderer)

    // 基础渲染
    const renderPass = new RenderPass(scene, camera)
    composer.value.addPass(renderPass)

    // 泛光效果
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    )
    composer.value.addPass(bloomPass)

    // 抗锯齿
    const smaaPass = new SMAAPass(
      window.innerWidth * renderer.getPixelRatio(),
      window.innerHeight * renderer.getPixelRatio()
    )
    composer.value.addPass(smaaPass)

    animate()
  }

  const animate = () => {
    if (composer.value) {
      composer.value.render()
    }
    animationId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    initPostProcessing()
  })

  onBeforeUnmount(() => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  })

  return {
    composer
  }
} 