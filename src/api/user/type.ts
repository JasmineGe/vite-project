// 定义用户相关数据的ts接口
export interface loginFormData {
    username: string,
    password: string
}
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
export interface loginResponseData extends ResponseData {
    data: string
}
export interface userInfoResponseData extends ResponseData {
    data: {
        routes: string[],
        buttons: string[],
        roles: string[],
        names: string,
        avatar: string
    }
}
interface userInfoType {
    userId: number,
    avatar: string,
    username: string,
    password: string,
    desc: string,
    roles: string[],
    buttons: string[],
    routes: string[],
    token: string
}
interface userType {
    checkUser: userInfoType
}
export interface userResponseData {
    code: number,
    data: userType
}