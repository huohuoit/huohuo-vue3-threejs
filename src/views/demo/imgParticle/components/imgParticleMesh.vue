<template>
  <TresPoints :position="[-8, 10, -2]" :scale="0.02">
    <TresBufferGeometry
      :position="[positionArray, 3]"
      :color_list="[colorListArray, 3]"
    />
    <TresShaderMaterial v-bind="smConfig" />
  </TresPoints>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import * as THREE from 'three'
import { useTexture } from '@tresjs/core'

const props = defineProps({
  zPos: { default: 1 },
  useCustomColor: { default: false },
  customColor: { default: '#ff0000' }
})

const pTexture = await useTexture(['/demo/faker.jpg'])
const canvas = document.createElement('canvas')
const w = pTexture.image.width
const h = pTexture.image.height
canvas.width = w
canvas.height = h
const ctx = canvas.getContext('2d')
ctx?.drawImage(pTexture.image, 0, 0)
const data = ctx?.getImageData(0, 0, w, h).data
const info = []
const colorList = []
if (data) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pixelIndex = (y * w + x) * 4

      if (data[pixelIndex + 3] > 0) {
        const r = data[pixelIndex] / 255
        const g = data[pixelIndex + 1] / 255
        const b = data[pixelIndex + 2] / 255

        const z = Math.random() * 100
        info.push(x, -y, z)
        colorList.push(r, g, b)
      }
    }
  }
}
const positionArray = new Float32Array(info)
const colorListArray = new Float32Array(colorList)

const smConfig = {
  uniforms: {
    zPos: { value: props.zPos },
    useCustomColor: { value: props.useCustomColor },
    customColor: { value: new THREE.Color(props.customColor) }
  },
  vertexShader: `
		attribute vec3 color_list;
		varying vec3 vColor;
		uniform float zPos;
		void main() {
			vec3 pos = position;
			pos.z *= zPos;
			vColor = color_list;
			vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
			vec4 viewPosition = viewMatrix * modelPosition;
			gl_PointSize = 0.001 * (1.0 - viewPosition.z);
			gl_Position = projectionMatrix * viewPosition;
		}`,
  fragmentShader: `
			varying vec3 vColor;
			uniform bool useCustomColor;
			uniform vec3 customColor;
			void main() {
			if(useCustomColor){
				gl_FragColor = vec4(customColor, 1.0);
			}else{
				gl_FragColor = vec4(vColor, 1.0);
			}
		}`,
  transparent: true,
  depthTest: false,
  blending: THREE.AdditiveBlending
} as any

watch(
  () => [props.zPos, props.useCustomColor, props.customColor],
  ([zPos, useCustomColor, customColor]) => {
    smConfig.uniforms.zPos.value = zPos
    smConfig.uniforms.useCustomColor.value = useCustomColor
    smConfig.uniforms.customColor.value.set(customColor)
  }
)
</script>
