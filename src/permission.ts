// 路由鉴权，项目中路由能否被访问的权限的设置
import router from '@/router'
import setting from './setting';
import nprogress from 'nprogress'
nprogress.configure({ showSpinner: false });
import 'nprogress/nprogress.css'
// 获取用户相关的仓库内部token数据，去判断用户是否登录
import useUserStore from '@/store/modules/user'

// 全局守卫：项目当中任意路由切换都会触发的钩子函数
// 全局前置守卫：访问某个路由之前的守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    document.title = `${setting.title} - ${to.meta.title}`
    nprogress.start()
    let userStore = useUserStore()
    let token = userStore.token
    let username = userStore.username
    // 登录成功
    if(token) {
        if(to.path === '/login') {
            next({ path: '/' })
        } else {
            // 有用户信息
            if (username) {
                next()
            } else {
                try {
                    await userStore.userInfo()
                    next()
                } catch (err) {
                    // token过期：获取不到用户信息 -> 退出登录 -> 用户相关数据清空
                    // 用户手动修改本地存储token
                    await userStore.userLogout()
                    // 加await保证退出登录成功之后再跳转
                    next({ path: '/login', query: {redirect: to.path}})
                }
            }
        }
    } else {
        // 未登录成功
        if (to.path === '/login') {
            next()
        } else {
            next({
                path: '/login', 
                query: {
                    redirect: to.path
                }
            })
        }
    }
}) 
// 全局后置守卫：访问某个路由之后的守卫
router.afterEach((to: any, from: any) => {
    nprogress.done()
}) 


/* 
    1. 任意路由切换实现进度条业务  --progress
    2. 路由鉴权（路由组件访问权限的设置）
        全部路由组件：登录｜404｜any｜首页｜数据大屏｜权限管理(3个子路由)｜商品管理(4个子路由)
        用户未登录：可以访问login，其余的6个路由不能访问(指向login)
        用户登录成功：不可以访问login(指向首页，其余的6个路由可以访问)
*/