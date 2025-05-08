export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
export interface MenuData {
    id: number,
    createTime: string,
    updateTime: string,
    pid: number,
    name: string,
    code: null,
    toCode: null,
    type: number,
    status: null,
    level: number,
    children: MenuList,
    select: boolean
}
export type MenuList = MenuData[]
export interface MenuResponseData extends ResponseData {
    data: MenuList
}
export interface MenuParams {
    id?: number,
    code: string,
    level: number,
    name: string,
    pid: number
}
