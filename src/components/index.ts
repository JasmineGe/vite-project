import SvgIcon from "@/components/SvgIcon/index.vue";
import * as ElementPlusIconsVue from '@element-plus/icons-vue' 
import Category from './Category/index.vue'

const allGlobalComponents: any = {
  SvgIcon,
  Category
};
// 对外暴露插件对象
export default {
  // 务必叫做install方法
  install(app: any) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, allGlobalComponents[key]);
    });
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
};
