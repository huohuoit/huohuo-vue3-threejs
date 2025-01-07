import { ref } from 'vue'
import { AmbientLight, DirectionalLight, SpotLight } from 'three'
import { useThreeScene } from '@/composables/useThreeScene/index'
import { LightSettings } from '@/types/config'

export function useSceneLights(initialSettings?: Partial<LightSettings>) {
  const lights = ref<{
    ambient?: AmbientLight
    directional?: DirectionalLight
    spot?: SpotLight
  }>({})

  const { getScene } = useThreeScene()

  const createLights = (settings: LightSettings) => {
    const scene = getScene()
    if (!scene) return

    // 清理现有灯光
    Object.values(lights.value).forEach(light => {
      light && scene.remove(light)
    })

    // 创建环境光
    const ambient = new AmbientLight(
      settings.ambient.color,
      settings.ambient.intensity
    )
    scene.add(ambient)
    lights.value.ambient = ambient

    // 创建平行光
    const directional = new DirectionalLight(
      settings.directional.color,
      settings.directional.intensity
    )
    directional.position.set(
      settings.directional.position.x,
      settings.directional.position.y,
      settings.directional.position.z
    )
    directional.castShadow = true
    scene.add(directional)
    lights.value.directional = directional
  }

  return {
    lights,
    createLights
  }
} 