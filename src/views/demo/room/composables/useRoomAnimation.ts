import { ref } from 'vue'
import { Object3D } from 'three'

export function useRoomAnimation(scene: any) {
  // 物体漂浮动画
  const floatingObjects = ref<
    { object: Object3D; initialY: number; phase: number }[]
  >([])

  // 初始化漂浮动画对象
  const initFloatingObjects = () => {
    if (!scene) return

    // 找到需要漂浮的物体
    const objects = ['CatPlushie', 'PhotoFrame', 'Plant']

    objects.forEach((objName) => {
      const obj = scene.getObjectByName(objName)
      if (obj) {
        floatingObjects.value.push({
          object: obj,
          initialY: obj.position.y,
          phase: Math.random() * Math.PI * 2 // 随机初始相位
        })
      }
    })
  }

  // 动画逻辑
  const animateRoom = () => {
    const time = Date.now() * 0.001 // 时间（秒）

    // 物体漂浮动画
    floatingObjects.value.forEach((item) => {
      if (item.object) {
        // 简单的正弦漂浮
        item.object.position.y =
          item.initialY + Math.sin(time + item.phase) * 0.05
        // 轻微旋转
        item.object.rotation.y = Math.sin(time * 0.5 + item.phase) * 0.03
      }
    })
  }

  return {
    initFloatingObjects,
    animateRoom
  }
}
