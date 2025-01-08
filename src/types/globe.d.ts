declare module 'globe.gl' {
  import { Scene, Camera } from 'three'

  export interface GlobeConfig {
    scale?: number
    scaleY?: number
    rotation?: number
    focus?: number
  }

  export interface GlobeInstance {
    globeImageUrl: (url: string) => GlobeInstance
    bumpImageUrl: (url: string) => GlobeInstance
    backgroundImageUrl: (url: string) => GlobeInstance
    pointsData: (data: any[]) => GlobeInstance
    pointColor: (callback: (() => string) | string) => GlobeInstance
    pointAltitude: (value: number | ((point: { lat: number; lng: number }) => number)) => GlobeInstance
    pointRadius: (value: number | string) => GlobeInstance
    pointsMerge: (merge: boolean) => GlobeInstance
    arcsData: (data: any[]) => GlobeInstance
    arcColor: (callback: (() => string[]) | string | string[]) => GlobeInstance
    arcDashLength: (value: number) => GlobeInstance
    arcDashGap: (value: number) => GlobeInstance
    arcDashAnimateTime: (value: number) => GlobeInstance
    onPointClick: (callback: (point: any) => void) => GlobeInstance
    controls: () => { autoRotate: boolean; autoRotateSpeed: number }
    scene: () => Scene
    camera: Camera
    scale: { set: (x: number, y: number, z: number) => void }
    atmosphereMaterial: { visible: boolean }
    dispose: () => void
    arcDashInitialGap: (callback: (() => number) | number) => GlobeInstance
    arcStroke: (width: number) => GlobeInstance
    arcsTransitionDuration: (duration: number) => GlobeInstance
    onGlobeClick: (callback: (coords: { lat: number; lng: number }) => void) => GlobeInstance
  }

  export default function Globe(config?: GlobeConfig): {
    (element: HTMLElement): GlobeInstance;
    new (element: HTMLElement): GlobeInstance;
  }
} pointsMerge