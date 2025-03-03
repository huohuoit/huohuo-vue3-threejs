<script setup lang="ts">
import { ref } from 'vue'
import { useRoomAudio } from '../composables/useRoomAudio'

const { playClickSound } = useRoomAudio()

const zoomIn = () => {
  playClickSound()
  // 调用相机操作逻辑
}

const zoomOut = () => {
  playClickSound()
  // 调用相机操作逻辑
}
</script>

<template>
  <div class="absolute bottom-4 right-4 z-40 flex flex-col gap-2">
    <button
      class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      @click="zoomIn"
    >
      <i class="i-carbon-zoom-in text-white text-xl"></i>
    </button>

    <button
      class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      @click="zoomOut"
    >
      <i class="i-carbon-zoom-out text-white text-xl"></i>
    </button>
  </div>
</template>
