<template>
  <div v-if="sceneStore.isLoading" class="scene-loader">
    <!-- Canvas 用于绘制粒子动画背景 -->
    <canvas id="particles"></canvas>
    <!-- 3D 立方体容器 -->
    <div class="cube-wrapper">
      <div class="cube">
        <!-- 立方体的六个面 -->
        <div class="cube-face front"></div>
        <div class="cube-face back"></div>
        <div class="cube-face right"></div>
        <div class="cube-face left"></div>
        <div class="cube-face top"></div>
        <div class="cube-face bottom"></div>
      </div>
    </div>
    <!-- 加载文本 -->
    <p class="loading-text">加载中...</p>
  </div>
</template>

<script setup lang="ts">
import { useSceneStore } from '@/stores/scene'
import { onMounted, onBeforeUnmount } from 'vue';

const sceneStore = useSceneStore()

// 粒子配置和动画逻辑
const initParticles = () => {
  // 添加延时确保 DOM 已完全加载
  setTimeout(() => {
    // 获取 canvas 元素和上下文
    const canvas = document.getElementById('particles') as HTMLCanvasElement;
    if (!canvas) return;  // 添加安全检查
    
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;  // 添加安全检查

    // 定义粒子数组及其属性类型
    let particles: Array<{
      x: number;      // x 坐标
      y: number;      // y 坐标
      vx: number;     // x 方向速度
      vy: number;     // y 方向速度
      size: number;   // 粒子大小
      alpha: number;  // 透明度
    }> = [];

    // 鼠标位置跟踪
    let mouse = { x: 0, y: 0 };
    
    // canvas 大小自适应函数
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 创建单个粒子的函数
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,  // 随机速度 (-1, 1)
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 2 + 1,     // 大小范围 1-3
      alpha: Math.random() * 0.5 + 0.5  // 透明度范围 0.5-1
    });

    // 初始化粒子数组
    const initParticles = () => {
      particles = Array(80).fill(null).map(() => createParticle());
    };

    // 绘制单个粒子
    const drawParticle = (p: typeof particles[0]) => {
      ctx.beginPath();
      // 创建径向渐变效果
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `rgba(96, 239, 255, ${p.alpha})`);
      gradient.addColorStop(1, 'rgba(96, 239, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    };

    // 绘制粒子之间的连线
    const drawLines = () => {
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // 当粒子距离小于 100 时绘制连线
          if (distance < 100) {
            ctx.beginPath();
            // 线的透明度随距离变化
            ctx.strokeStyle = `rgba(96, 239, 255, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
    };

    // 动画主循环
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // 计算粒子到鼠标的距离和吸引力
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 鼠标吸引力效果
        if (distance < 200) {
          const force = (200 - distance) / 2000;  // 力的大小与距离成反比
          p.vx += dx * force;  // 应用 x 方向的力
          p.vy += dy * force;  // 应用 y 方向的力
        }

        // 更新粒子位置
        p.x += p.vx;
        p.y += p.vy;

        // 边界碰撞检测和反弹
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // 应用摩擦力，使粒子逐渐减速
        p.vx *= 0.99;
        p.vy *= 0.99;

        drawParticle(p);
      });

      drawLines();  // 绘制粒子间的连线
      animationFrame = requestAnimationFrame(animate);  // 继续下一帧动画
    };

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // 初始化
    resizeCanvas();
    initParticles();
    animate();

    // 事件监听器绑定
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    // 返回清理函数
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, 0);
};

let cleanup: (() => void) | undefined;

onMounted(() => {
  const cleanupFn = initParticles();
  if (cleanupFn) cleanup = cleanupFn;
});

onBeforeUnmount(() => {
  cleanup?.();
});
</script>

<style scoped>
/* 基础布局样式 */
.scene-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.92);
  z-index: 9999;
}

/* 加载文本样式 */
.loading-text {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 2;
  background: linear-gradient(45deg, #60efff, #00ff87);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(96, 239, 255, 0.3);
}

/* 3D 立方体容器样式 */
.cube-wrapper {
  width: 100px;
  height: 100px;
  perspective: 400px;
  position: relative;
  z-index: 2;
}

/* 立方体样式 */
.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: cube-spin 2s infinite linear;
  filter: drop-shadow(0 0 20px rgba(96, 239, 255, 0.8));
  backdrop-filter: blur(5px);
}

/* 立方体各面的样式 */
.cube-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(96, 239, 255, 0.8),
    rgba(0, 255, 135, 0.8)
  );
  box-shadow: 0 0 15px rgba(96, 239, 255, 0.5);
  opacity: 0.8;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* 立方体各面的 3D 变换 */
.front  { transform: rotateY(0deg) translateZ(50px); }
.back   { transform: rotateY(180deg) translateZ(50px); }
.right  { transform: rotateY(90deg) translateZ(50px); }
.left   { transform: rotateY(-90deg) translateZ(50px); }
.top    { transform: rotateX(90deg) translateZ(50px); }
.bottom { transform: rotateX(-90deg) translateZ(50px); }

/* 立方体旋转动画 */
@keyframes cube-spin {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: rotateX(180deg) rotateY(180deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
}

/* 添加发光效果 */
.cube-face::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%);
  animation: glow 1.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 0.8;
  }
}

/* 添加模糊效果 */
.cube {
  filter: drop-shadow(0 0 15px rgba(96, 239, 255, 0.6));
}

/* Canvas 样式 */
#particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style> 