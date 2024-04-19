import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist', // 指定输出目录
    assetsDir: 'assets', // 指定生成静态资源的存放路径
    minify: 'terser', // 指定压缩器
    sourcemap: false, // 是否生成 source map
  },
  plugins: [vue(),
  // ...
  AutoImport({
    resolvers: [ElementPlusResolver(),
    // 自动导入图标组件
    IconsResolver({
      prefix: 'Icon',
    }),
    ],
  }),
  Components({
    resolvers: [// 自动注册图标组件
      IconsResolver({
        enabledCollections: ['ep'],
      }),
      ElementPlusResolver()],
  }),
  Icons({
    autoInstall: true,
  }),
  ],

  resolve: {
    alias: {
      // 使用 @ 符号指向 src 目录
      '@': '/src',
    }
  }
})
