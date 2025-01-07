<template>
  <div class="home">
    <!-- 3D 背景场景 -->
    <canvas ref="canvasRef" class="background-scene" />

    <!-- 主要内容区 -->
    <div class="content">
      <div class="hero-section">
        <h1 class="title">
          <span class="gradient-text">Vue3 + Three.js</span>
        </h1>
        <p class="subtitle gradient-text-light">探索无限可能的 3D 世界</p>
      </div>

      <div class="glass-container main-content">
        <div class="button-group">
          <router-link to="/scene" class="scene-link primary glass-button">
            <span class="button-content">
              <span class="icon">🚀</span>
              进入3D场景
            </span>
          </router-link>

          <a
            href="https://github.com/huohuoit/huohuo-vue3-threejs"
            target="_blank"
            class="scene-link secondary glass-button"
          >
            <span class="button-content">
              <span class="icon">⭐</span>
              GitHub
            </span>
          </a>
        </div>

        <div class="features">
          <div
            class="feature-item glass-card"
            v-for="(feature, index) in features"
            :key="index"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useParticles } from '@/composables/useParticles'

// 特性列表数据
const features = [
  {
    icon: '🎮',
    title: '交互体验',
    description: '沉浸式的 3D 交互体验'
  },
  {
    icon: '⚡',
    title: '高性能',
    description: 'WebGL 渲染，性能优化'
  },
  {
    icon: '🎨',
    title: '视觉效果',
    description: '精美的视觉设计和动画'
  }
]

const canvasRef = ref<HTMLCanvasElement | null>(null)
let particlesInstance: { cleanup: () => void } | null = null

onMounted(() => {
  nextTick(() => {
    if (!canvasRef.value) return

    particlesInstance = useParticles(canvasRef.value, {
      count: 8000,
      size: 0.08,
      color: '#42b883',
      opacity: 0.9,
      spread: 40,
      speed: {
        x: 0.0003,
        y: 0.0003
      }
    })
  })
})

onBeforeUnmount(() => {
  if (particlesInstance) {
    particlesInstance.cleanup()
  }
})
</script>

<style scoped>
.home {
  position: relative;
  height: 100vh;
  overflow: hidden;
  color: white;
  background: radial-gradient(
    circle at center,
    rgba(10, 10, 10, 0.3) 0%,
    rgba(10, 10, 10, 0.7) 100%
  );
}

.background-scene {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  padding: 0;
  text-align: center;
  max-width: 1400px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-section {
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding-top: 2rem;
}

.glass-container {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 30px;
  margin: 0 2rem 2rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-height: calc(60vh - 4rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.main-content {
  margin-top: auto;
}

.title {
  font-size: 5rem;
  margin-bottom: 1rem;
  position: relative;
  text-shadow: 0 0 30px rgba(66, 184, 131, 0.3);
}

.gradient-text {
  position: relative;
  display: inline-block;
  background: linear-gradient(45deg, #42b883, #64ffda);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 2rem;
  margin-bottom: 3rem;
  text-shadow: 0 0 20px rgba(100, 255, 218, 0.3);
}

.gradient-text-light {
  background: linear-gradient(45deg, #42b883 30%, #64ffda 70%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.glass-button {
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(66, 184, 131, 0.2);
}

.scene-link {
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.scene-link.primary {
  background: linear-gradient(
    45deg,
    rgba(66, 184, 131, 0.8),
    rgba(53, 73, 94, 0.8)
  );
  color: white;
}

.scene-link.secondary {
  color: white;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.scene-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(66, 184, 131, 0.4);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.glass-card {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(66, 184, 131, 0.2);
}

.feature-item {
  padding: 2rem;
  border-radius: 15px;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.feature-item h3 {
  color: #64ffda;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature-item p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 35vh;
    padding-top: 1rem;
  }

  .glass-container {
    max-height: calc(65vh - 4rem);
    margin: 1rem;
    padding: 1rem;
    backdrop-filter: blur(15px);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .button-group {
    flex-direction: column;
    margin-bottom: 2rem;
    flex-shrink: 0;
  }

  .features {
    grid-template-columns: 1fr;
    padding: 0.5rem;
  }
}

/* 自定义滚动条样式 */
.glass-container::-webkit-scrollbar {
  width: 6px;
}

.glass-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.glass-container::-webkit-scrollbar-thumb {
  background: rgba(66, 184, 131, 0.3);
  border-radius: 3px;
}

.glass-container::-webkit-scrollbar-thumb:hover {
  background: rgba(66, 184, 131, 0.5);
}
</style>
