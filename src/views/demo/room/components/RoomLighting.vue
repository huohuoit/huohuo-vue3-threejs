<script setup lang="ts">
import { ref } from 'vue'

const ambientIntensity = ref(0.5)
const mainLightIntensity = ref(1.0)
</script>

<template>
  <TresAmbientLight :intensity="ambientIntensity" color="#ffffff" />

  <TresDirectionalLight
    :position="[5, 5, 5]"
    :intensity="mainLightIntensity"
    :cast-shadow="true"
    shadow-map-size="[2048, 2048]"
  >
    <TresDirectionalLightHelper :size="1" :color="0xffff00" />
  </TresDirectionalLight>

  <!-- 壁灯 -->
  <TresPointLight
    :position="[-2, 2, 1]"
    :intensity="0.8"
    :distance="5"
    :color="'#ff9900'"
    :decay="2"
  />

  <!-- 电脑屏幕灯光 -->
  <TresSpotLight
    :position="[0.5, 1.5, -2]"
    :intensity="0.6"
    :angle="Math.PI / 6"
    :penumbra="0.2"
    :color="'#5599ff'"
    :cast-shadow="true"
  />
</template>
