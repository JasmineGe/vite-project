// 封装本地读取数据
export const SET_TOKEN = (token: string) => {
    localStorage.setItem('TOKEN', token)
}

export const GET_TOKEN = () => {
    localStorage.getItem('TOKEN')
}