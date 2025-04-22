export interface responseData {
    code: string,
    message: string,
    ok: boolean
}
export interface TradeMark {
    id?: number,
    tmName: string,
    logoUrl: string
}
export type Records = TradeMark[]
export interface TradeMarkReponseData extends responseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}