export class BtcPriceVO {
    no: string; //순번
    coinId: string; // 코인 아이디
    coinName: string; 
    usdPrice: number;
    regDate : Date;
    netChange: number;
    regulation: number;

    constructor(no: string, coinId: string, coinName: string, usdPrice: number, regDate: Date){
        this.no=no;
        this.coinId=coinId;
        this.coinName=coinName;
        this.usdPrice=usdPrice;
        this.regDate=regDate;
        this.netChange=0;
        this.regulation=0;
    }
}