import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import ThreeScene from '@/components/ThreeScene.vue'
import { useThreeScene } from '@/composables/useThreeScene/index'
import { useSceneStore } from '@/stores/scene'

vi.mock('@/composables/useThreeScene/index')
vi.mock('@/stores/scene')

describe('ThreeScene', () => {
  beforeEach(() => {
    vi.mocked(useThreeScene).mockReturnValue({
      initScene: vi.fn(),
      animate: vi.fn(),
      cleanup: vi.fn(),
      getScene: vi.fn(),
      getCamera: vi.fn(),
      getRenderer: vi.fn(),
      setAnimationEnabled: vi.fn(),
      controls: ref(null),
      resetCamera: vi.fn()
    })

    vi.mocked(useSceneStore).mockReturnValue({
      isLoading: false,
      error: null,
      setLoading: vi.fn(),
      setError: vi.fn(),
      setConfig: vi.fn()
    } as any)
  })

  it('mounts successfully', () => {
    const wrapper = mount(ThreeScene)
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes scene on mount', async () => {
    const wrapper = mount(ThreeScene)
    await wrapper.vm.$nextTick()

    const { initScene, animate } = useThreeScene()
    expect(initScene).toHaveBeenCalled()
    expect(animate).toHaveBeenCalled()
  })

  it('handles errors during initialization', async () => {
    const error = new Error('Test error')
    vi.mocked(useThreeScene).mockReturnValue({
      ...useThreeScene(),
      initScene: vi.fn().mockImplementation(() => {
        throw error
      })
    })

    const wrapper = mount(ThreeScene)
    await wrapper.vm.$nextTick()

    const store = useSceneStore()
    expect(store.setError).toHaveBeenCalledWith(error.message)
  })
})
