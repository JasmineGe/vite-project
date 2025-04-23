import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import type { loginFormData, loginResponseData, userInfoResponseData } from "@/api/user/type"
import type { UserState } from './types/type'
import { defineStore } from "pinia";
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由
import { constantRoute } from "@/router/routes";

let useUserStore = defineStore('User', {
    // 小仓库存储数据的
    state: ():UserState => {
        return {
            token: GET_TOKEN(), // 用户唯一标识 token
            menuRoutes: constantRoute, //仓库存储菜单需要生成的数组
            username: '',
            avatar: ''
        }
    },
    // 处理异步逻辑的地方
    actions: {
        // 用户登录的方法
        async userLogin(data:loginFormData)  {
            let result:loginResponseData = await reqLogin(data)
            if (result.code === 200) {
                this.token = (result.data as string)
                SET_TOKEN(result.data as string)
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        // 获取用户信息
        async userInfo() {
            let result:userInfoResponseData = await reqUserInfo()
            if (result.code === 200) {
                this.username = result.data.username
                this.avatar = result.data.avatar
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        //退出登录
        async userLogout() {
            let result:any = await reqLogout()
            if (result.code === 200) {
                // 目前没有mock退出登录接口：退出登录接口（通知服务器本地用户唯一标识token失效）
                this.token = ''
                this.username = ''
                this.avatar = ''
                REMOVE_TOKEN()
                return 'ok'
            }
        }
    },
    getters: {}
})
export default useUserStore