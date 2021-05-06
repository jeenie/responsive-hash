export class UserInfoVO {
    USER_ID:string;
    USER_PW?:string;
    REC_USER:string;
    REC_DIR:string;
    USER_R:string;
    USER_L:string;
    USER_EMAIL:string;
    USER_PHONE_CN?:string;
    USER_PHONE:string;
    USER_NAME:string;
    USER_LANGUAGE_CD?:string;
    TERMS_AGREE_YN?:string;
    GROPUP_CD?:string;
    OPT_KEY?:string;
    OTP_USER_YN?:string;
    MNAUTH_CD?:string;
    USER_LVL?:string;	
    AVA_YN?:string;
    LOCK_YN?:string;
    USE_FLAG?:string;
    REG_DATE?:string;	
    REG_USER?:string;	
    UP_DATE?:string;
    UP_USER?:string;

    constructor(USER_ID: string, USER_NAME: string, USER_PHONE: string, USER_EMAIL: string, USER_PHONE_CN: string, REC_USER: string, REC_DIR: string, USER_R: string, USER_L: string, REG_DATE: string){
        this.USER_ID=USER_ID;
        this.USER_NAME=USER_NAME;
        this.USER_PHONE=USER_PHONE;
        this.USER_EMAIL=USER_EMAIL;
        this.USER_PHONE_CN=USER_PHONE_CN;
        this.REC_USER=REC_USER;
        this.REC_DIR=REC_DIR;
        this.USER_L=USER_L;
        this.USER_R=USER_R;
        this.REG_DATE=REG_DATE;
    }

}
