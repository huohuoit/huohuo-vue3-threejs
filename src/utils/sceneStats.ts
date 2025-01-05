import Stats from 'three/examples/jsm/libs/stats.module.js'

export class SceneStats {
  private stats: Stats
  private isEnabled: boolean

  constructor() {
    this.stats = new Stats()
    this.isEnabled = false
  }

  enable() {
    if (!this.isEnabled) {
      document.body.appendChild(this.stats.dom)
      this.isEnabled = true
    }
  }

  disable() {
    if (this.isEnabled) {
      document.body.removeChild(this.stats.dom)
      this.isEnabled = false
    }
  }

  update() {
    if (this.isEnabled) {
      this.stats.update()
    }
  }
} 