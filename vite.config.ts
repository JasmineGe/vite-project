import { defineConfig, loadEnv, type PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { viteMockServe } from 'vite-plugin-mock'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

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
      // 自动开启分析页面
      visualizer({ open: true }) as PluginOption,
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip', // gzip/brotliCompress
        ext: '.gz', //gz/br
        deleteOriginFile: false, // 压缩后是否删除压缩源文件
      })
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
      publicPath: './',
      // 关闭生产map文件，可以达到缩小打包体积
      // 这个生产环境一定要关闭，不然打包的产物会很大
      sourcemap: false,
      // 关闭文件计算
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1600,
      terserOptions: {
        compress: {
          // 生产环境时移除console debugger
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions:{
        output:{
          // 最小化拆分包
          manualChunks(id: any) {
            // 将 node_modules 中的依赖打包
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
            // 自定义分包规则，例如将 lodash 单独打包
            if (id.includes('lodash')) {
              return 'lodash';
            }
            // 其他业务代码按需分包
            if (id.includes('src/pages/')) {
              return 'pages';
            }
          },
          // 引入文件名的名称
          chunkFileNames: 'js/[name]-[hash].js',
          // 包的入口文件名称
          entryFileNames: 'js/[name]-[hash].js',
          // 资源文件如字体，图片等
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        }
      }
    },
  }
});
