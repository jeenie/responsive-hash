export class RecentTransactionVO {
    no: number;
    usdPrice: number;
    gubun: string;
    amount: number;
    regDate: Date;

    constructor(usdPrice: number, gubun:string, amount: number, regDate: Date) {
        this.no=0;
        this.usdPrice = usdPrice;
        this.gubun = gubun;
        this.amount = amount;
        this.regDate = regDate;
    }
}