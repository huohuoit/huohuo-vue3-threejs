<template>
  <div class="scene-stats" v-if="enabled">
    <!-- 用于挂载stats.js性能面板的容器 -->
    <div ref="statsRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Stats from 'stats.js' // 导入性能监控库stats.js

// 定义组件props,enabled用于控制是否显示性能面板
const props = withDefaults(defineProps<{
  enabled?: boolean
}>(), {
  enabled: true // 默认启用
})

const statsRef = ref<HTMLDivElement>()
let stats: Stats | null = null

// 组件挂载时初始化stats
onMounted(() => {
  if (props.enabled && statsRef.value) {
    stats = new Stats() // 创建stats实例
    statsRef.value.appendChild(stats.dom) // 将stats面板添加到DOM中
    animate() // 开始动画循环
  }
})

const animate = () => {
  stats?.update() // 更新stats数据
  requestAnimationFrame(animate) // 递归调用以持续更新
}

// 组件卸载前清理
onBeforeUnmount(() => {
  stats?.dom.remove() // 移除stats面板
})
</script>

<style scoped>
.scene-stats {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100; /* 确保显示在其他元素之上 */
}
</style> 