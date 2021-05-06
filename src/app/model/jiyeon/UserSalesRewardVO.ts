import { UserProductSimpleVO } from "./UserProductSimpleVO";

export class UserSalesRewardVO {
    userId: string;
    totalCoin: number;
    totalUsd: number;
    childList?: UserProductSimpleVO[][];

    constructor(userId: string,totalCoin: number, totalUsd: number, childList: UserProductSimpleVO[][]) {
        this.userId = userId;
        this.totalCoin = totalCoin;
        this.totalUsd = totalUsd;
        this.totalCoin = totalCoin;
        this.childList = childList;
    }
}