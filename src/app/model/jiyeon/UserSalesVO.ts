import { UserProductSimpleVO } from "./UserProductSimpleVO";

export class UserSalesVO {
    userId: string;
    totalCoin: number;
    totalUsd: number;
    childList?: UserProductSimpleVO[][];

    constructor(userId: string,totalCoin: number, totalUsd: number) {
        this.userId = userId;
        this.totalCoin = totalCoin;
        this.totalUsd = totalUsd;
        this.totalCoin = totalCoin;
    }
}