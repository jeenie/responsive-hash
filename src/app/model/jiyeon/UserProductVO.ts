export class UserProductVO {
    PT_CODE: string;
    USER_ID: string;
    PRODUCT_CD: string;
    PRODUCT_TYPE: string;
    PRODUCT_STATE: string;
    PRODUCT_THS: string;
    AP_DATE: Date;
    GD_DATE: string;
    ST_COIN: number;
    CRT_USD: number;
    AUTO_SHIP: string;
    REG_DATE: Date;
    REG_USER: string;
    UP_DATE: Date;
    UP_USER: string;
    USE_FLAG: string;
    child_status?: number;
    exp_date?: Date;
    final_child: boolean;
    total_coin: number;
    total_usd: number;


    constructor(PT_CODE: string, USER_ID: string,  PRODUCT_CD: string, PRODUCT_TYPE: string, PRODUCT_STATE: string,  PRODUCT_THS:string, AP_DATE:Date, GD_DATE: string, ST_COIN:number, CRT_USD:number, AUTO_SHIP:string, REG_DATE: Date, REG_USER:string, UP_DATE: Date,  UP_USER: string, USE_FLAG: string){
        this.PT_CODE=PT_CODE;
        this.USER_ID=USER_ID;
        this.PRODUCT_CD=PRODUCT_CD;
        this.PRODUCT_TYPE=PRODUCT_TYPE;
        this.PRODUCT_STATE=PRODUCT_STATE;
        this.PRODUCT_THS=PRODUCT_THS;
        this.AP_DATE=AP_DATE;
        this.GD_DATE=GD_DATE
        this.ST_COIN=ST_COIN;
        this.CRT_USD=CRT_USD;
        this.AUTO_SHIP=AUTO_SHIP;
        this.REG_DATE=REG_DATE;
        this.REG_USER=REG_USER;
        this.UP_DATE=UP_DATE;
        this.UP_USER=UP_USER;
        this.USE_FLAG=USE_FLAG;
        this.final_child = false;
        this.total_coin =0;
        this.total_usd = 0;
    }

}
