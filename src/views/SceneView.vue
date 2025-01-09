<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import ThreeGlobe from 'globe.gl'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { GlobeInstance } from 'globe.gl'

// 地球实例引用
const globeEl = ref<HTMLDivElement>()
const globe = ref<GlobeInstance | null>(null)

// 数据状态
const points = ref<any[]>([])

// 深圳的经纬度坐标
const SHENZHEN_COORDINATES = { lat: 22.5431, lng: 114.0579 }


// 在 script setup 顶部添加新的着色器代码
const pointVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    // 将点位稍微抬高一点，避免z-fighting
    vec3 newPosition = position + normal * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}`

const pointFragmentShader = `
uniform vec3 color;
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    // 计算到中心的距离
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // 创建多层次动态波纹
    float wave1 = sin(dist * 30.0 - time * 2.0) * 0.5 + 0.5;
    float wave2 = sin(dist * 20.0 - time * 1.5) * 0.5 + 0.5;
    float wave3 = sin(dist * 40.0 - time * 3.0) * 0.5 + 0.5;
    
    // 创建旋转效果
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float rotatingWave = sin(angle * 6.0 + time * 2.0) * 0.5 + 0.5;
    
    // 边缘渐变
    float edge = smoothstep(0.5, 0.2, dist);
    
    // 计算法线与视角的夹角
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    
    // 创建闪烁效果
    float sparkle = sin(time * 3.0) * 0.5 + 0.5;
    
    // 合并所有波纹效果
    float wavePattern = wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3;
    wavePattern = mix(wavePattern, rotatingWave, 0.3);
    
    // 计算最终透明度
    float alpha = wavePattern * edge;
    alpha *= (1.0 - fresnel * 0.5);
    alpha *= 0.8 + sparkle * 0.2;
    
    // 创建渐变色效果
    vec3 baseColor = color;
    vec3 glowColor = vec3(1.0, 1.0, 1.0);  // 白色光晕
    float colorMix = sin(time + dist * 10.0) * 0.5 + 0.5;
    
    // 添加中心发光效果
    float centerGlow = smoothstep(0.15, 0.0, dist);
    float pulsingGlow = (sin(time * 4.0) * 0.5 + 0.5) * centerGlow;
    
    // 合并所有颜色效果
    vec3 finalColor = mix(baseColor, glowColor, colorMix * 0.3);
    finalColor = mix(finalColor, glowColor, pulsingGlow);
    finalColor *= 1.0 + pulsingGlow * 2.0;
    
    gl_FragColor = vec4(finalColor, alpha);
}`

// 初始化地球
const initGlobe = () => {
  if (!globeEl.value) return

  globe.value = ThreeGlobe()(globeEl.value)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .customLayerData(points.value)
    .customThreeObject((d) => {
      const geometry = new THREE.CircleGeometry(d.size * 2.5, 64)
      const material = new THREE.ShaderMaterial({
        vertexShader: pointVertexShader,
        fragmentShader: pointFragmentShader,
        transparent: true,
        uniforms: {
          color: { value: new THREE.Color(d.color) },
          time: { value: 0 }
        },
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.userData.material = material
      return mesh
    })
    .customThreeObjectUpdate((obj, d) => {
      const phi = ((90 - d.lat) * Math.PI) / 180
      const theta = ((180 + d.lng) * Math.PI) / 180
      const r = 100 * 1.001 // 非常轻微地抬高

      // 设置位置
      obj.position.x = r * Math.sin(phi) * Math.cos(theta)
      obj.position.y = r * Math.cos(phi)
      obj.position.z = r * Math.sin(phi) * Math.sin(theta)

      // 计算法线方向并应用旋转
      const normal = obj.position.clone().normalize()
      obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    })

  // 设置控制器
  const controls = globe.value!.controls() as OrbitControls
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
  
  // 优化控制器设置
  controls.enableZoom = true
  controls.minDistance = 180 // 调整最小缩放距离
  controls.maxDistance = 1000 // 调整最大缩放距离
  controls.zoomSpeed = 5.0   // 显著增加缩放速度
  controls.rotateSpeed = 1.0 // 保持旋转速度不变
  controls.enableDamping = true
  controls.dampingFactor = 0.05 // 减小阻尼系数，使缩放更灵敏

  // 获取场景对象
  const scene = globe.value!.scene()

  // 设置环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  // 设置点光源
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(100, 100, 100)
  scene.add(pointLight)
}

// 生成随机数据点
const generateRandomPoints = (count: number) => {
  return Array.from({ length: count }, () => ({
    lat: (Math.random() - 0.5) * 140 + 20,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() * 2 + 1.5,
    color: new THREE.Color()
      .setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.6)
      .getStyle()
  }))
}

// 添加点位动画效果
const animatePoints = () => {
  if (!globe.value) return

  points.value.forEach((point) => {
    if (!point.initialSize) {
      point.initialSize = point.size
    }

    gsap.to(point, {
      size: point.initialSize * (1 + Math.random() * 0.3),
      duration: 1 + Math.random(),
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    })
  })
}

// 生命周期钩子
onMounted(() => {
  points.value = [
    {
      ...SHENZHEN_COORDINATES,
      size: 1,
      color: '#ff2d2d'
    },
    ...generateRandomPoints(30)
  ]

  initGlobe()
  animatePoints()

  // 启动动画循环
  const animate = () => {
    // 更新所有点的时间uniform
    globe.value?.scene().traverse((object) => {
      if (object instanceof THREE.Mesh && object.userData.material) {
        object.userData.material.uniforms.time.value = performance.now() / 1000
      }
    })

    requestAnimationFrame(animate)
  }
  animate()
})

onBeforeUnmount(() => {
  if (globe.value) {
    globe.value.dispose()
  }
})
</script>

<template>
  <div class="scene-container">
    <div ref="globeEl" class="globe-container"></div>
  </div>
</template>

<style scoped>
.scene-container {
  width: 100%;
  height: 100vh;
  background: #000;
}

.globe-container {
  width: 100%;
  height: 100%;
}
</style>
