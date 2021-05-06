export class UserProductSimpleVO {
    PT_CODE: string;
    USER_ID: string;
    PRODUCT_TYPE: string;
    PRODUCT_STATE: string;
    PRODUCT_THS: string;
    ST_COIN: number; // 상품 가격 coin
    CRT_USD: number; // 상품 가격 usd
    REG_DATE: Date;
    REG_USER: string; //부모 사용자
    //child_status?: number; // 몇세대 인지?
    //exp_date?: Date;
    final_child: boolean;
    total_coin: number;
    total_usd: number;


    constructor(PT_CODE: string,USER_ID: string,  PRODUCT_TYPE: string, PRODUCT_STATE: string,  PRODUCT_THS:string,  ST_COIN:number, CRT_USD:number, REG_DATE: Date, REG_USER:string){
        this.PT_CODE=PT_CODE;
        this.USER_ID=USER_ID;
        this.PRODUCT_TYPE=PRODUCT_TYPE;
        this.PRODUCT_STATE=PRODUCT_STATE;
        this.PRODUCT_THS=PRODUCT_THS;
        this.ST_COIN=ST_COIN;
        this.CRT_USD=CRT_USD;
        this.REG_DATE=REG_DATE;
        this.REG_USER=REG_USER;
        this.final_child = false;
        this.total_coin =0;
        this.total_usd = 0;
    }

}
