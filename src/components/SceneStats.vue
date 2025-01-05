<template>
  <div class="scene-stats" v-if="enabled">
    <div ref="statsRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Stats from 'stats.js'

const props = withDefaults(defineProps<{
  enabled?: boolean
}>(), {
  enabled: true
})

const statsRef = ref<HTMLDivElement>()
let stats: Stats | null = null

onMounted(() => {
  if (props.enabled && statsRef.value) {
    stats = new Stats()
    statsRef.value.appendChild(stats.dom)
    animate()
  }
})

const animate = () => {
  stats?.update()
  requestAnimationFrame(animate)
}

onBeforeUnmount(() => {
  stats?.dom.remove()
})
</script>

<style scoped>
.scene-stats {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
</style> 