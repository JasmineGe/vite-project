import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
// command用于获取当前开发环境
export default defineConfig(({command, mode}) => {
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
        "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
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
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
});
