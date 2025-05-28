import { defineConfig, loadEnv, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { viteMockServe } from 'vite-plugin-mock'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
// command用于获取当前开发环境
export default defineConfig(async ({command, mode}) => {
  // 获取各种环境下对应的变量
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      viteMockServe({
        localEnabled: command === 'serve', // 保证开发环境阶段可以使用mock接口
      }),
      visualizer({ open: true }) as PluginOption
    ],
    // scss全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@use "@/styles/variable.scss" as *;',
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    // 代理环境
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 获取数据的服务器地址
          target: env.VITE_SERVICE,
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path:any) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      // minify: 'terser',
      // outDir: env.VITE_OUT_DIR || 'dist',
      // sourcemap: false,
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true
      //   }
      // },
      // chunkSizeWarningLimit: 1500,
      rollupOptions:{
        output:{
          manualChunks(id: any) {
            // 将 node_modules 中的依赖打包到 vendor.js
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            // 自定义分包规则，例如将 lodash 单独打包
            if (id.includes('lodash')) {
              return 'lodash';
            }
            // 其他业务代码按需分包
            if (id.includes('src/pages/')) {
              return 'pages';
            }
          }
        }
      }
    },
  }
});
