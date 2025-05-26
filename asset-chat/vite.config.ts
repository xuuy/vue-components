import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      presets: [
        presetUno(),
        presetAttributify()
      ],
      theme: {
        colors: {
          primary: '#c8f855',
          dark: {
            100: '#eee',
            200: '#aaa',
            300: '#555',
            400: '#444',
            500: '#333',
            600: '#222',
            700: '#111',
            800: '#0a0a0a',
            900: '#000'
          },
        }
      },
      shortcuts: {
        'base-input': 'bg-dark-600 border border-dark-300 rounded color-primary p-1',
        'base-button': 'py-2 px-4 border-none rounded font-bold cursor-pointer',
        'primary-button': 'base-button bg-primary text-dark-900',
        'secondary-button': 'base-button bg-blue-500 text-white',
        'neutral-button': 'base-button bg-dark-400 text-dark-100',
      }
    })
  ]
})
