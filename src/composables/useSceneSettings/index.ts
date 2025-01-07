import { ref, watch } from 'vue'
import { Color } from 'three'
import { useThreeScene } from '@/composables/useThreeScene/index'
import { SceneSettings } from '@/types/config'

const DEFAULT_SETTINGS: SceneSettings = {
  antialias: true,
  shadows: true,
  pixelRatio: window.devicePixelRatio,
  backgroundColor: '#000000'
}

export function useSceneSettings(initialSettings?: Partial<SceneSettings>) {
  const settings = ref<SceneSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings
  })

  const { getRenderer, getScene } = useThreeScene()

  watch(settings, (newSettings) => {
    const renderer = getRenderer()
    const scene = getScene()

    if (renderer && scene) {
      renderer.setPixelRatio(newSettings.pixelRatio)
      renderer.shadowMap.enabled = newSettings.shadows
      scene.background = new Color(newSettings.backgroundColor)
    }
  }, { deep: true })

  return {
    settings
  }
} 