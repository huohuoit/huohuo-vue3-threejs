import { ref } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useThreeScene } from '@/hooks/useThreeScene'
import { useSceneStore } from '@/stores/scene'

export function useModelLoader() {
  const models = ref(new Map())
  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  const sceneStore = useSceneStore()
  const { getScene } = useThreeScene()

  // 配置 DRACO 解码器
  dracoLoader.setDecoderPath('/draco/')
  loader.setDRACOLoader(dracoLoader)

  const loadModel = async (url: string, name: string) => {
    try {
      sceneStore.setLoading(true)
      const gltf = await loader.loadAsync(url)
      models.value.set(name, gltf.scene)
      
      const scene = getScene()
      if (scene) {
        scene.add(gltf.scene)
      }
      
      return gltf.scene
    } catch (error) {
      sceneStore.setError(error instanceof Error ? error.message : 'Failed to load model')
      throw error
    } finally {
      sceneStore.setLoading(false)
    }
  }

  const removeModel = (name: string) => {
    const model = models.value.get(name)
    if (model) {
      const scene = getScene()
      scene?.remove(model)
      models.value.delete(name)
    }
  }

  return {
    models,
    loadModel,
    removeModel
  }
} 