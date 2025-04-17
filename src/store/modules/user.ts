import { reqLogin } from "@/api/user";
import type { loginForm, loginResponseData } from "@/api/user/type"
import type { UserState } from './types/type'
import { defineStore } from "pinia";
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
// 引入路由
import { constantRoute } from "@/router/routes";

let useUserStore = defineStore('User', {
    // 小仓库存储数据的
    state: ():UserState => {
        return {
            token: GET_TOKEN(),
            menuRoutes: constantRoute //仓库存储菜单需要生成的数组
        }
    },
    // 处理异步逻辑的地方
    actions: {
        async userLogin(data:loginForm)  {
            let result:loginResponseData = await reqLogin(data)
            if (result.code === 200) {
                this.token = (result.data.token as string)
                SET_TOKEN(result.data.token as string)
                return 'ok'
            } else {
                return Promise.reject(new Error(result.data.message))
            }
        }
    }
    // getters: {}
})
export default useUserStore