import { ref } from 'vue'

type AudioResource = {
  url: string
  volume?: number
  loop?: boolean
}

const audioMap: Record<string, AudioResource> = {
  bgm: {
    url: 'music/cosmic_candy.ogg',
    volume: 0.5,
    loop: true
  }
  // ... 更多音频配置
}

export function createAudio(key: keyof typeof audioMap): HTMLAudioElement {
  const resource = audioMap[key]
  const audio = new Audio(
    new URL(`../assets/audio/${resource.url}`, import.meta.url).href
  )

  if (resource.volume !== undefined) audio.volume = resource.volume
  if (resource.loop !== undefined) audio.loop = resource.loop

  return audio
}

export function useRoomAudio() {
  const isBgmPlaying = ref(false)
  let audioElement: HTMLAudioElement | null = null

  // 初始化音频
  const initAudio = () => {
    audioElement = createAudio('bgm')
  }

  // 切换背景音乐
  const toggleBgm = () => {
    if (!audioElement) initAudio()

    if (isBgmPlaying.value) {
      audioElement?.pause()
    } else {
      audioElement?.play()
    }

    isBgmPlaying.value = !isBgmPlaying.value
  }

  return {
    isBgmPlaying,
    toggleBgm
  }
}
