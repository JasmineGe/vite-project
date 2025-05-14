import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import type { loginFormData, loginResponseData, userInfoResponseData } from "@/api/user/type"
import type { UserState } from './types/type'
import { defineStore } from "pinia";
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由
import { constantRoute, asnycRoute, anyRoute } from "@/router/routes";
import router from '@/router'
// @ts-ignore
import cloneDeep from 'lodash/cloneDeep'

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asnycRoute: any, routes: any) {
    return asnycRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
            if (item.children?.length) {
                item.children = filterAsyncRoute(item.children, routes)
            }
            return true
        }
    })
}

let useUserStore = defineStore('User', {
    // 小仓库存储数据的
    state: (): UserState => {
        return {
            token: GET_TOKEN(), // 用户唯一标识 token
            menuRoutes: constantRoute, //仓库存储菜单需要生成的数组
            username: '',
            avatar: '',
            // 存储当前用户是否包含某一个按钮
            buttons: []
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
                this.username = result.data.name
                this.avatar = result.data.avatar
                this.buttons = result.data.buttons
                
                // 计算当前用户需要展示的路由
                let userAsyncRoutes = filterAsyncRoute(cloneDeep(asnycRoute), result.data.routes)
                // 菜单需要的数据整理完毕
                this.menuRoutes = [...constantRoute, ...userAsyncRoutes, anyRoute]
                // 目前路由器管理的只有常量路由，用户计算完毕异步路由/任意路由动态追加
                let allRoutes = [...userAsyncRoutes, anyRoute]
                allRoutes.forEach((route: any) => router.addRoute(route))

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