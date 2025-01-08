<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import ThreeGlobe from 'globe.gl'
import { gsap } from 'gsap'
import * as THREE from 'three'
import type { GlobeInstance } from 'globe.gl'

// 地球实例引用
const globeEl = ref<HTMLDivElement>()
const globe = ref<GlobeInstance | null>(null)

// 数据状态
const points = ref<any[]>([])
const arcs = ref<any[]>([])
const alerts = ref<any[]>([])

// 深圳的经纬度坐标
const SHENZHEN_COORDINATES = { lat: 22.5431, lng: 114.0579 }

// 修改预警效果的数据结构
interface Alert {
  lat: number
  lng: number
  maxR: number
  propagationSpeed: number
  repeatPeriod: number
  pointData: any
  altitude: number
}

// 初始化地球
const initGlobe = () => {
  if (!globeEl.value) return

  globe.value = ThreeGlobe()(globeEl.value)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
    .pointsData(points.value)
    .pointColor('color')
    .pointAltitude(0.1)
    .pointRadius('size')
    .pointsMerge(false)
    .arcsData(arcs.value)
    .arcColor('color')
    .arcDashLength(0.6)
    .arcDashGap(0.3)
    .arcDashInitialGap(() => Math.random() * 5)
    .arcDashAnimateTime(2000)
    .arcStroke(0.5)
    .arcsTransitionDuration(1000)
    .pointAltitude(({ lat, lng }) =>
      lat === SHENZHEN_COORDINATES.lat && lng === SHENZHEN_COORDINATES.lng
        ? 0.2
        : 0.1
    )
    .enablePointerInteraction(true)
    .onPointClick((point: any, event?: MouseEvent) => {
      console.log('Point clicked:', point, event)
      if (point && point.lat !== undefined && point.lng !== undefined) {
        createAlert(point.lat, point.lng, point)
      }
    })
    // .onGlobeClick(({ lat, lng }) => {
    //   console.log('Globe clicked:', { lat, lng })
    //   // 将点击坐标转换为地球表面坐标
    //   const phi = (90 - lat) * (Math.PI / 180)
    //   const theta = (180 - lng) * (Math.PI / 180)
    //   createAlert(phi, theta)
    // })

  // 设置控制器
  const controls = globe.value!.controls()
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5

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
    size: Math.random() * 0.5 + 0.5,
    color: ['#4dffff', '#fff', '#fffc00'][Math.floor(Math.random() * 3)]
  }))
}

// 生成飞线数据
const generateArcs = (points: any[]) => {
  return points.map((endPoint) => ({
    startLat: SHENZHEN_COORDINATES.lat,
    startLng: SHENZHEN_COORDINATES.lng,
    endLat: endPoint.lat,
    endLng: endPoint.lng,
    color: [
      ['#4dffff', '#378888'],
      ['#fffc00', '#988b1c'],
      ['#ff2d2d', '#881414']
    ][Math.floor(Math.random() * 3)]
  }))
}

// 修改创建预警效果的函数
const createAlert = (lat: number, lng: number, pointData?: any) => {
  console.log('Creating alert at:', lat, lng, pointData)
  const alert: Alert = {
    lat,
    lng,
    maxR: 0.2,
    propagationSpeed: 5,
    repeatPeriod: 1000,
    pointData,
    altitude: pointData?.altitude || 0.1 // 使用点的高度或默认值
  }

  alerts.value.push(alert)

  gsap.to(alert, {
    maxR: 3,
    duration: 1.5,
    ease: 'power2.out',
    onComplete: () => {
      alerts.value = alerts.value.filter((a) => a !== alert)
    }
  })
}

// 渲染预警环
const renderAlerts = () => {
  if (!globe.value) return
  const scene = globe.value.scene()
  
  // 清除旧的预警环
  scene.children = scene.children.filter(
    (child) => !(child instanceof THREE.Mesh && child.userData.isAlert)
  )

  alerts.value.forEach((alert) => {
    // 获取地球对象
    const globeObject = scene.children.find(
      obj => obj instanceof THREE.Mesh && (obj as any).userData.__globeObjType === 'Globe'
    ) as THREE.Mesh

    if (globeObject) {
      // 计算点的位置
      const lat = alert.lat * Math.PI / 180
      const lng = -alert.lng * Math.PI / 180
      const radius = 100.5 + alert.altitude

      // 使用球坐标系计算位置
      const phi = Math.PI / 2 - lat
      const theta = lng

      const position = new THREE.Vector3()
      position.setFromSphericalCoords(radius, phi, theta)
      position.applyMatrix4(globeObject.matrixWorld)

      // 创建预警环
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(alert.maxR, alert.maxR + 0.3, 32),
        new THREE.MeshBasicMaterial({
          color: 0xff4444,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
          depthTest: false
        })
      )

      ring.userData.isAlert = true
      ring.position.copy(position)

      // 计算环的朝向
      const normal = position.clone().normalize()
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)

      scene.add(ring)
    }
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
  arcs.value = generateArcs(points.value.slice(1))

  initGlobe()

  const updateInterval = setInterval(() => {
    arcs.value = generateArcs(points.value.slice(1))
  }, 3000)

  // 启动动画循环
  const animate = () => {
    renderAlerts()
    requestAnimationFrame(animate)
  }
  animate()

  onBeforeUnmount(() => {
    clearInterval(updateInterval)
  })
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
