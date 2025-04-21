// layout组件相关配置的仓库
import { defineStore } from "pinia";

let useLayoutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false , // 用户控制菜单折叠
            refresh: false, // 用于控制刷新效果
        }
    }
})
export default useLayoutSettingStore