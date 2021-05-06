export class UserWalletHistoryVO {
    NO: string;
    WALLET_ID: string;
    USER_ID: string;
    PUBKEY: string;
    FEE: string;
    TX: string;
    PAY_GUBUN: string;
    PAY_STATE: string;
    COIN: number;
    COIN_ID: string;
    CONFIRM:string;
    REG_DATE: Date;
    REG_USER: string;
    UP_DATE: string;
    UP_USER: string;
    USE_FLAG: string;
    END_FLAG: string;

    constructor(NO: string, WALLET_ID: string, USER_ID: string, PUBKEY: string, FEE: string, TX: string, PAY_GUBUN: string, PAY_STATE: string, COIN: number, COIN_ID: string, CONFIRM:string, REG_DATE: Date, REG_USER: string, UP_DATE: string, UP_USER: string, USE_FLAG: string, END_FLAG: string) {
        this.NO = NO;
        this.WALLET_ID = WALLET_ID;
        this.USER_ID = USER_ID;
        this.PUBKEY = PUBKEY;
        this.FEE = FEE;
        this.TX = TX; 
        this.PAY_GUBUN = PAY_GUBUN;
        this.PAY_STATE = PAY_STATE;
        this.COIN = COIN;
        this.COIN_ID = COIN_ID;
        this.CONFIRM = CONFIRM;
        this.REG_DATE = REG_DATE;
        this.REG_USER = REG_USER;
        this.UP_DATE = UP_DATE;
        this.UP_USER = UP_USER;
        this.USE_FLAG = USE_FLAG;
        this.END_FLAG =END_FLAG;
    }
}