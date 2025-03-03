<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TresCanvas, useRenderLoop, useTexture } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import RoomModel from './RoomModel.vue'
import RoomLighting from './RoomLighting.vue'
import { useRoomAnimation } from '../composables/useRoomAnimation'

const props = defineProps<{
  enableControls?: boolean
}>()

const emit = defineEmits<{
  loaded: []
  progress: [progress: number]
}>()

const sceneReady = ref(false)
const { animateRoom } = useRoomAnimation()

const totalAssets = ref(0)
const loadedAssets = ref(0)

const handleAssetLoaded = () => {
  loadedAssets.value++
  emit('progress', (loadedAssets.value / totalAssets.value) * 100)

  if (loadedAssets.value === totalAssets.value) {
    sceneReady.value = true
    emit('loaded')
  }
}

// 设置资产总数
onMounted(() => {
  // 这里的数值需要根据实际资产数量调整
  totalAssets.value = 15
})

// 启动渲染循环
const { onLoop } = useRenderLoop()
onLoop(() => {
  if (sceneReady.value) {
    animateRoom()
  }
})
</script>

<template>
  <TresCanvas
    clear-color="#000000"
    shadows
    alpha
    antialias
    camera-position="[0, 1.6, 5]"
    class="w-full h-screen"
  >
    <TresPerspectiveCamera
      :position="[0, 1.6, 5]"
      :fov="75"
      :near="0.1"
      :far="100"
    />

    <!-- 灯光设置 -->
    <RoomLighting />

    <!-- 房间模型 -->
    <RoomModel @asset-loaded="handleAssetLoaded" />

    <!-- 相机控制 -->
    <OrbitControls
      v-if="props.enableControls"
      :enable-damping="true"
      :damping-factor="0.05"
      :max-polar-angle="Math.PI / 2 - 0.1"
      :min-distance="3"
      :max-distance="10"
    />
  </TresCanvas>
</template>
