import type { RollupOptions } from 'rollup'

export const embeddedRollup: RollupOptions = {
  output: {
    entryFileNames: 'ats/[hash].js', //'ats/[name].[hash].js'
    assetFileNames: 'ats/[hash][extname]', //'ats/[name].[hash][extname]'
    chunkFileNames: 'ats/[hash].js', //'ats/[name].[hash].js'
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        return 'v' // id.split('node_modules/')[1].split('/')[0]
      }
      return 'z'
    }
  }
}
