import pinia from "@/store"
import useUserStore from "@/store/modules/user"

let userStore = useUserStore(pinia)

export const isHasButton = (app: any) => {
    // 全局自定义指令实现按钮权限
    app.directive('has', {
        // 使用这个全局自定义指令的 DOM｜组件 挂载完毕的时候会执行一次
        mounted(el:any, options: any) {
            if(!userStore.buttons.includes(options.value)) {
                el.parentNode.removeChild(el)
            }
        }
    })
}