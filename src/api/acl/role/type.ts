export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
export interface Role {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName: string,
    remark?: null
}
export type Records = Role[]
export interface RoleResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        pages: number
    }
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
