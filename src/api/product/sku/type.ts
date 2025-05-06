
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
export interface Attr {
    id?: number,
    attrId: string | number,
    valueId: string | number,
}
export interface SaleAttr {
    id?: number,
    saleAttrId: string | number,
    saleAttrValueId: string | number,
}
export interface SkuData {
    category3Id?: string | number,
    spuId?: string | number,
    tmId?: string | number,
    skuName?: string,
    price?: string | number,
    weight?: string | number,
    skuDesc?: string,
    skuAttrValueList?: Attr[],
    skuSaleAttrValueList?: SaleAttr[],
    skuDefaultImg?: string,
    isSale?: number,
    id?: number
}
export interface SkuResponseData extends ResponseData {
    data: {
        records: SkuData[],
        total: number,
        size: number,
        current: number,
        orders: [],
        optimizedCountSql: boolean,
        hitCount: boolean,
        countId: number,
        maxLimit: number,
        searchCount: boolean,
        pages: number
    }
}
export interface SkuInfoData extends ResponseData {
    data: SkuData
}