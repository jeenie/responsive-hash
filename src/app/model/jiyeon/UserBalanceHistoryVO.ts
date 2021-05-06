export class UserBalanceHistoryVO {
    WALLET_HISTORY_SEQ: string;
    WALLET_ID: string;
    USER_ID: string;
    GUBUN: string;
    SORT: string;
    COIN_ID: string;
    AMOUNT: number;
    BALANCE: number;
    REASON: string;
    REASON_DETAIL: string;
    REG_DATE: Date;
    REG_USER: string;
    UP_DATE: string;
    UP_USER: string;
    USE_FLAG: string;

    constructor(WALLET_HISTORY_SEQ: string, WALLET_ID: string, USER_ID: string, GUBUN: string, SORT: string, COIN_ID: string, AMOUNT: number, BALANCE: number, REASON: string, REASON_DETAIL: string, REG_DATE: Date, REG_USER: string, UP_DATE: string, UP_USER: string, USE_FLAG: string) {
        this.WALLET_HISTORY_SEQ = WALLET_HISTORY_SEQ;
        this.WALLET_ID = WALLET_ID;
        this.USER_ID = USER_ID;
        this.GUBUN = GUBUN;
        this.SORT = SORT;
        this.COIN_ID = COIN_ID;
        this.AMOUNT = AMOUNT;
        this.BALANCE = BALANCE;
        this.REASON = REASON;
        this.REASON_DETAIL = REASON_DETAIL;
        this.REG_DATE = REG_DATE;
        this.REG_USER = REG_USER;
        this.UP_DATE = UP_DATE;
        this.UP_USER = UP_USER;
        this.USE_FLAG = USE_FLAG;
    }
}