import { ref, onMounted } from 'vue'
import { SceneConfig } from '@/types/three'
import { getSceneConfig } from '@/api/scene'
import { mergeSceneConfig } from '@/utils/sceneConfig'
import { useSceneStore } from '@/stores/scene'

export function useSceneConfig() {
  const config = ref<SceneConfig | null>(null)
  const sceneStore = useSceneStore()

  const loadConfig = async () => {
    try {
      sceneStore.setLoading(true)
      const apiConfig = await getSceneConfig()
      config.value = mergeSceneConfig(apiConfig)
      sceneStore.setConfig(config.value)
    } catch (error) {
      sceneStore.setError(error instanceof Error ? error.message : 'Failed to load config')
    } finally {
      sceneStore.setLoading(false)
    }
  }

  onMounted(() => {
    loadConfig()
  })

  return {
    config,
    loadConfig
  }
} 