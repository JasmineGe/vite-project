import request from "@/utils/request";
import type {SpuData, HasSpuResponseData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, skuData, SkuInfoData } from "./type";

enum API {
    // 获取已有SPU数据
    HASSPU_URL = '/admin/product/',
    // 获取全部品牌数据
    AllTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
    // 获取某个SPU下全部售卖商品的图片数据
    IMG_URL = '/admin/product/spuImageList/',
    // 获取某一个SPU下全部已有销售属性
    HASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
    // 获取整个项目全部销售属性[颜色/版本/尺码]
    ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
    // 添加SPU
    ADDSPU_URL = '/admin/product/saveSpuInfo',
    // 更新已有的SPU
    UPDATESPU_URL = '/admin/product/updateSpuInfo',
    // 追加一个新增的SKU　
    ADDSKU_URL = '/admin/product/saveSkuInfo',
    // 查看某一个已有的SPU下全部售卖的商品
    SKUINFO_URL = '/admin/product/findBySpuId/',
    REMOVESPU_URL = '/admin/product/deleteSpu/'
}

export const reqHasSpu = (page: number, limit: number, category3Id: number | string) => request.get<any, HasSpuResponseData>(API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)
export const reqAllTradeMark = () => request.get<any, AllTradeMark>(API.AllTRADEMARK_URL)
export const reqSpuImgList = (spuId: number) => request.get<any, SpuHasImg>(API.IMG_URL + spuId)
export const reqSpuHasSaleAttr = (spuId: number) => request.get<any, SaleAttrResponseData>(API.HASSALEATTR_URL + spuId)
export const reqAllSpuSaleAttr = () => request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
export const reqAddOrUpdateSpu = (data: SpuData) => {
    if (data.id) {
        return request.post<any, any>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, any>(API.ADDSPU_URL, data)
    }
}
export const reqAddSku = (data: skuData) => request.post<any, any>(API.ADDSKU_URL, data)
export const reqSkuList = (spuId: number | string) => request.post<any, SkuInfoData>(API.SKUINFO_URL + spuId)
export const reqRemoveSpu = (spuId: number | string) => request.delete<any, any>(API.REMOVESPU_URL + spuId)