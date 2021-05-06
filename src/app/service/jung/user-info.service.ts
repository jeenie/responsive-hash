import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInfoVO } from 'src/app/model/jung/userInfoVO';
import { UserInfoProductVO } from 'src/app/model/jung/userInfoProductVO';


// Set the http options
// const headers = new HttpHeaders()

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private URL = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getUserInfos(): Observable<UserInfoVO[]> {
    return this.http.get<UserInfoVO[]>(this.URL + "userInfos");
  }

  getUserInfos2(): Observable<UserInfoProductVO[]> {
    return this.http.get<UserInfoProductVO[]>(this.URL + "userInfos");
  }

  addUserInfo(userInfo: UserInfoVO): Observable<any> {
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(userInfo);
    // console.log(body);
    return this.http.post<UserInfoVO>(this.URL + "userInfo", body, { 'headers': headers, observe: 'response' })
  }

  updateChildUserInfo(USER_ID: string, DIR: string, CHILD_ID: string): Observable<any> {
    const headers = { "Content-Type": "application/json" };
    console.log("angular" + USER_ID + " " + DIR + " " + CHILD_ID)
    return this.http.put<any>(this.URL + "childUserInfo/" + USER_ID, { "DIR": DIR, "CHILD_ID": CHILD_ID }, { 'headers': headers, observe: 'response' })
  }

  deleteUserInfo(USER_ID: string): Observable<any> {
    const headers = { "Content-Type": "application/json" };
    return this.http.delete<any>(this.URL + "userInfo/" + USER_ID, { 'headers': headers, observe: 'response' })
  }

  //해당 아이디의 회원 객체 조회
  //아이디 중복 검사
  getUserInfo(USER_ID: string): Observable<any> {
    return this.http.get<any>(this.URL + "usrInfo/" + USER_ID, { observe: 'response' })
  }

  //이메일 인증
  checkEmail(EMAIL: string, EMAIL_CODE: string): Observable<any> {
    return this.http.post<any>(this.URL + "checkEmail", { "EMAIL": EMAIL, "EMAIL_CODE": EMAIL_CODE }, { observe: 'response' })
  }

  //두 회원 자리교환
  swapUserInfo(USER_ID1: string, USER_ID2: string): Observable<any> {
    return this.http.put<any>(this.URL + "swapUserInfo", { "USER_ID1": USER_ID1, "USER_ID2": USER_ID2 }, { observe: 'response' })
  }

  //회원 정보 업데이트
  updateUserInfo(USER_ID:string, user: UserInfoVO): Observable<any> {
    const headers = { "Content-Type": "application/json" };
    let u = JSON.stringify(user);
    console.log(u)
    return this.http.put<any>(this.URL + "userInfo/" + USER_ID, u, { 'headers': headers, observe: 'response' })
  }

}
