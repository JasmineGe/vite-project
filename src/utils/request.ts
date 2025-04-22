// 进行axios的二次封装：使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user';

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
})
request.interceptors.request.use((config) => {
    // config 配置对象，headers属性请求头,经常给服务器端携带公共参数
    let userStore = useUserStore()
    if(userStore.token) {
        config.headers.token = userStore.token
    }
    return config
})
request.interceptors.response.use((res) => {
    return res.data
}, (err) => {
    let message = ''
    let status = err.response ? err.response.status : ''
    switch(status) {
        case 401: 
            message = 'TOKEN过期'
            break;
        case 403:
            message = '无权访问'
            break
        case 404: 
            message ='请求地址错误'
            break
        case 500:
            message ='服务器出现问题'
            break
        default:
            message ='网络出现问题'
    }
    ElMessage({
        type: 'error',
        message
    })
    return Promise.reject(err)
})

export default request