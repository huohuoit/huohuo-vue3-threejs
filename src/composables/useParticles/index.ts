import * as THREE from 'three'

export interface ParticlesConfig {
  count?: number
  size?: number
  color?: string
  opacity?: number
  spread?: number
  speed?: {
    x: number
    y: number
  }
  mouseEffect?: boolean
  trail?: boolean
}

const DEFAULT_CONFIG: ParticlesConfig = {
  count: 5000,
  size: 0.2,
  color: '#42b883',
  opacity: 0.8,
  spread: 40,
  speed: {
    x: 0.0003,
    y: 0.0003
  },
  mouseEffect: true,
  trail: true
}

export function useParticles(canvas: HTMLCanvasElement, config: ParticlesConfig = {}) {
  let particles: THREE.Points | undefined
  let animationId: number
  let renderer: THREE.WebGLRenderer
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let mouse = new THREE.Vector2()
  let targetRotation = new THREE.Vector2()
  let clock = new THREE.Clock()

  const createParticles = () => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true,
      antialias: false,
      powerPreference: "default"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(1)

    const mergedConfig = { ...DEFAULT_CONFIG, ...config }
    
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(mergedConfig.count! * 3)
    const colors = new Float32Array(mergedConfig.count! * 3)
    const scales = new Float32Array(mergedConfig.count!)
    const randomness = new Float32Array(mergedConfig.count! * 3)
    
    const color = new THREE.Color(mergedConfig.color)
    
    for (let i = 0; i < mergedConfig.count!; i++) {
      const i3 = i * 3
      
      // 螺旋星系分布
      const radius = Math.random() * mergedConfig.spread!
      const spinAngle = radius * 0.35
      const branchAngle = (i % 3) * Math.PI * 2 / 3
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY * 2
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
      
      // 存储随机值用于动画
      randomness[i3] = randomX
      randomness[i3 + 1] = randomY
      randomness[i3 + 2] = randomZ

      // 颜色渐变 - 从中心到边缘
      const mixColor = new THREE.Color('#ffffff')
      const mixStrength = radius / mergedConfig.spread!
      color.lerp(mixColor, mixStrength * 0.6)
      
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      scales[i] = Math.random()
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('randomness', new THREE.BufferAttribute(randomness, 3))

    // 使用基础材质替代着色器材质（提高webgl性能）
    const material = new THREE.PointsMaterial({
      size: mergedConfig.size,
      vertexColors: true,
      transparent: true,
      opacity: mergedConfig.opacity,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // 事件监听
    window.addEventListener('resize', handleResize)
    if (mergedConfig.mouseEffect) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchmove', handleTouchMove)
    }

    // 开始动画循环
    clock.start()
    animate()
  }

  const animate = () => {
    if (particles) {
      // 简化动画逻辑
      particles.rotation.x += 0.001
      particles.rotation.y += 0.001
      
      renderer.render(scene, camera)
    }
    animationId = requestAnimationFrame(animate)
  }

  const handleMouseMove = (event: MouseEvent) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    
    targetRotation.x = mouse.y * 0.5
    targetRotation.y = mouse.x * 0.5
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1
      
      targetRotation.x = mouse.y * 0.5
      targetRotation.y = mouse.x * 0.5
    }
  }

  const handleResize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  const cleanup = () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleTouchMove)
    
    if (scene && particles) {
      scene.remove(particles)
      particles.geometry.dispose()
      if (particles.material instanceof THREE.ShaderMaterial) {
        particles.material.dispose()
      }
      renderer.dispose()
    }
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }

  createParticles()

  return {
    particles,
    cleanup
  }
} 