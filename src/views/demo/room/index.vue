<script setup lang="ts">
import { ref } from 'vue'
import RoomScene from './components/RoomScene.vue'
import { useRoomAudio } from './composables/useRoomAudio'

const isLoading = ref(true)
const loadingProgress = ref(0)
const { toggleBgm } = useRoomAudio()

const handleSceneLoaded = () => {
  isLoading.value = false
}

const handleProgressUpdate = (progress: number) => {
  loadingProgress.value = progress
}
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- 加载画面 -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex flex-col items-center justify-center z-50"
    >
      <div class="text-3xl font-bold text-purple-400 mb-4">火火的房间</div>
      <div class="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-purple-500 transition-all duration-300"
          :style="{ width: `${loadingProgress}%` }"
        ></div>
      </div>
      <div class="mt-2 text-white">{{ Math.floor(loadingProgress) }}%</div>
    </div>

    <!-- 背景音乐控制按钮 -->
    <button
      class="absolute top-4 right-4 z-40 p-2 border-amber-300 rounded-full bg-orange/20 hover:bg-orange/30 transition-colors cursor-pointer"
      @click="toggleBgm"
    >
      <div class="i-carbon-music text-purple-400 text-xl"></div>
    </button>

    <!-- 3D场景 -->
    <RoomScene @loaded="handleSceneLoaded" @progress="handleProgressUpdate" />
  </div>
</template>
