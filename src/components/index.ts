import SvgIcon from "@/components/SvgIcon/index.vue";
import * as ElementPlusIconsVue from '@element-plus/icons-vue' 

const allGlobalComponents = {
  SvgIcon,
};
// 对外暴露插件对象
export default {
  // 务必叫做install方法
  install(app) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, allGlobalComponents[key]);
    });
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
};
