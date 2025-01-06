import type { InjectionKey } from 'vue'
import type { useThreeScene } from '@/hooks/useThreeScene'

export const ThreeSceneKey = Symbol() as InjectionKey<ReturnType<typeof useThreeScene>> 