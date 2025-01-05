import { Scene, Object3D, BoxHelper, AxesHelper } from 'three'

export class SceneDebug {
  private scene: Scene
  private debugObjects: Map<string, Object3D>

  constructor(scene: Scene) {
    this.scene = scene
    this.debugObjects = new Map()
  }

  addBoundingBox(object: Object3D, name: string) {
    const box = new BoxHelper(object, 0xff0000)
    this.scene.add(box)
    this.debugObjects.set(`box_${name}`, box)
  }

  addAxes(size = 5) {
    const axes = new AxesHelper(size)
    this.scene.add(axes)
    this.debugObjects.set('axes', axes)
  }

  remove(name: string) {
    const object = this.debugObjects.get(name)
    if (object) {
      this.scene.remove(object)
      this.debugObjects.delete(name)
    }
  }

  clear() {
    this.debugObjects.forEach((object) => {
      this.scene.remove(object)
    })
    this.debugObjects.clear()
  }
} 