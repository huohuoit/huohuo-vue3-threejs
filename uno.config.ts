import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(), // 核心基础预设（如：<div class="flex items-center p-4">）
    presetAttributify(), // 属性化模式预设（如：<div flex items-center p-4>），可选，使代码更清晰
    presetIcons({
      // 图标预设,支持如 i-carbon-settings 的类名写法。详见: https://unocss.nodejs.cn/presets/icons
      // 可选配置,会增加构建体积,
      scale: 1.2, // 图标缩放比例
      cdn: 'https://esm.sh/' // CDN 地址
    })
  ],
  shortcuts: [
    [
      'glass-card',
      'backdrop-blur-md bg-white/8 border-1 border-white/20 rounded-xl p-8 transition-all duration-300 hover:bg-white/12 hover:translate-y-[-5px] hover:shadow-lg hover:shadow-primary/20'
    ],
    ['glass-container', 'backdrop-blur-xl bg-white/5 border-1 border-white/15'],
    [
      'btn',
      'px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark transition-colors duration-300'
    ]
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#42b883',
        dark: '#33a06f'
      }
    }
  }
}) 