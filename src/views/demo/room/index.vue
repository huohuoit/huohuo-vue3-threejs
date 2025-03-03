<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import RoomScene from './components/RoomScene.vue'
import { useRoomAudio } from './composables/useRoomAudio'
// import useRoomAudio from './composables/useRoomAudio'

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
  <div class="relative w-full h-screen overflow-hidden bg-black">
    <!-- 加载画面 -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black"
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
      class="absolute top-4 right-4 z-40 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      @click="toggleBgm"
    >
      <i class="i-carbon-music text-white text-xl"></i>
    </button>

    <!-- 3D场景 -->
    <RoomScene @loaded="handleSceneLoaded" @progress="handleProgressUpdate" />
  </div>
</template>
