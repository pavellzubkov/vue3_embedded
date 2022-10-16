import vue from '@vitejs/plugin-vue'
import type { RollupOptions } from 'rollup'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { embeddedRollup } from './buildOpts'

process.env.VUE_APP_VERSION = process.env.npm_package_version
process.env.VUE_APP_AUTOR = process.env.npm_package_autor

export default ({ mode }: never) => {
  const rollupOpts: RollupOptions = mode === 'embedded' ? embeddedRollup : {}

  return defineConfig({
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'icon',
            alias: {
              park: 'icon-park'
            }
          })
        ]
      }),
      Components({
        dts: true,
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'icon',
            alias: {
              park: 'icon-park'
            }
          })
        ]
      }),
      Icons({
        compiler: 'vue3',
        autoInstall: true
      }),
      viteCompression({ deleteOriginFile: mode === 'embedded', threshold: 1, filter: /\.(js|mjs|json|css)$/i })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    /*    optimizeDeps: {
      exclude: ['node_modules']
    },*/
    build: {
      rollupOptions: rollupOpts,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version)
    }
  })
}
