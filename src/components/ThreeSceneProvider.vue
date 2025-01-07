<script setup lang="ts">
import { provide } from 'vue'
import { useThreeScene } from '@/composables/useThreeScene/index'
import { ThreeSceneKey } from '@/symbols/threeScene'

// 创建 three scene 实例
const threeScene = useThreeScene()

// 提供给子组件
provide(ThreeSceneKey, threeScene)
</script>

<template>
  <slot></slot>
</template>
