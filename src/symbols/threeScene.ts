import type { InjectionKey } from 'vue'
import { useThreeScene } from '@/composables/useThreeScene/index'

export const ThreeSceneKey = Symbol() as InjectionKey<ReturnType<typeof useThreeScene>> 