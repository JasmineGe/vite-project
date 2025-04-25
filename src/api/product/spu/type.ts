export interface ResponseData {
    code: number | string,
    message: string,
    ok: boolean
}
export interface SpuData {
    id?: number,
    spuName: string,
    description: string,
    category3Id: string | number,
    tmId: number | string,
    spuImageList: null | SpuImg[],
    spuSaleAttrList: null | SaleAttr[]
}
export type Records = SpuData[]
export interface HasSpuResponseData extends ResponseData{
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        pages: number,
        searchCount: boolean
    }
}
export interface TradeMark {
    id: number,
    tmName: string,
    logoUrl: string
}
export interface AllTradeMark extends ResponseData {
    data: TradeMark[]
}
export interface SpuImg {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    imgName?: string,
    imgUrl?: string,
    name?: string,
    url?: string
}
export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}
export interface SaleAttrvalue {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: boolean
}
export type SpuSaleAttrValueList = SaleAttrvalue[]
export interface SaleAttr {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: SpuSaleAttrValueList,
    flag?: boolean,
    saleAttrValue?: string
}
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}
export interface HasSaleAttr {
    id: number,
    name: string
}
export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}
export interface Attr {
    attrId: string | number,
    valueId: string | number
}
export interface SaleAttr {
    saleAttrId: string | number,
    saleAttrValueId: string | number
}
export interface SkuData {
    category3Id: string | number,
    spuId: string | number,
    tmId: string | number,
    skuName: string,
    price: string | number,
    weight: string | number,
    skuDesc: string,
    skuAttrValueList: Attr[],
    skuSaleAttrValueList: SaleAttr[],
    skuDefaultImg: string
}
export interface SkuInfoData extends ResponseData {
    data: SkuData[]
}