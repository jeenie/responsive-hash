export class UserInfoVO {
    USER_ID: string;
    USER_PW: string;
    REC_USER: string;
    REC_DIR: string;
    USER_R: string;
    USER_L: string;
    USER_EMAIL: string;
    USER_PHONE_CN: string;
    USER_PHONE: string;
    USER_NAME: string;
    USER_LANGUAGE_CD: string;
    TERMS_AGREE_YN: string;
    GROPUP_CD: string;
    OTP_KEY: string;
    OTP_USE_YN: string;
    MNAUTH_CD: string;
    USER_LVL: string;
    AVA_YN: string;
    LOCK_YN: string;
    USE_FLAG: string;
    REG_DATE: string;
    REG_USER: string;
    UP_DATE: string;
    UP_USER: string;



    constructor()
    constructor(USER_ID: string, USER_PW: string, REC_USER: string, REC_DIR: string, USER_R: string, USER_L: string, USER_EMAIL: string, USER_PHONE_CN: string, USER_PHONE: string, USER_NAME: string, REG_DATE: string)
    constructor(USER_ID?: string, USER_PW?: string, REC_USER?: string, REC_DIR?: string, USER_R?: string, USER_L?: string, USER_EMAIL?: string, USER_PHONE_CN?: string, USER_PHONE?: string, USER_NAME?: string, USER_LANGUAGE_CD?: string, TERMS_AGREE_YN?: string, GROPUP_CD?: string, OTP_KEY?: string, OTP_USE_YN?: string, MNAUTH_CD?: string, USER_LVL?: string, AVA_YN?: string, LOCK_YN?: string, USE_FLAG?: string, REG_DATE?: string, REG_USER?: string, UP_DATE?: string, UP_USER?: string) {
        this.USER_ID = USER_ID || "";
        this.USER_PW = USER_PW || "";
        this.REC_USER = REC_USER || "";
        this.REC_DIR = REC_DIR || "";
        this.USER_R = USER_R || "\\n";
        this.USER_L = USER_L || "\\n";
        this.USER_EMAIL = USER_EMAIL || "";
        this.USER_PHONE_CN = USER_PHONE_CN || "CL001";
        this.USER_PHONE = USER_PHONE || "";
        this.USER_NAME = USER_NAME || "";
        this.USER_LANGUAGE_CD = USER_LANGUAGE_CD || "\\n";
        this.TERMS_AGREE_YN = TERMS_AGREE_YN || "Y";
        this.GROPUP_CD = GROPUP_CD || "HSH01";
        this.OTP_KEY = OTP_KEY || "\\n";
        this.OTP_USE_YN = OTP_USE_YN || "N";
        this.MNAUTH_CD = MNAUTH_CD || "MN000003";
        this.USER_LVL = USER_LVL || "001";
        this.AVA_YN = AVA_YN || "N";
        this.LOCK_YN = LOCK_YN || "N";
        this.USE_FLAG = USE_FLAG || "Y";
        this.REG_DATE = REG_DATE || "";
        this.REG_USER = REG_USER || "\\n"; // 수정 필요
        this.UP_DATE = UP_DATE || "\\n";
        this.UP_USER = UP_USER || "\\n";

    }
}
