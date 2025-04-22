import request from "@/utils/request";
import type { TradeMarkReponseData, TradeMark } from './type.ts'
enum API{
    TRADEMARK_URL = '/admin/product/baseTrademark/',
    ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
    UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
    DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/'
}

// page：获取几页，默认第一页
// limit：获取几个已有品牌的数据
export const reqHasTrademark = (page:number, limit:number) => request.get<any, TradeMarkReponseData>(API.TRADEMARK_URL + `${page}/${limit}`)

export const reqAddOrUpdateTrademark = (data: TradeMark) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
    } else {
        return request.post<any, any>(API.ADDTRADEMARK_URL, data)
    }
}
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETETRADEMARK_URL + id)