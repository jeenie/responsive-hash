import { Component, OnInit } from '@angular/core';
import { ChartSelectionChangedEvent, ChartType } from 'angular-google-charts';

import { UserInfoService } from 'src/app/service/jung/user-info.service';
import { UserPorductMyService } from 'src/app/service/jung/user-porduct-my.service';

import { UserInfoProductVO } from 'src/app/model/jung/userInfoProductVO';
import { ProductVO } from 'src/app/model/jung/productVO';

@Component({
  selector: 'app-lineage-tree',
  templateUrl: './lineage-tree.component.html',
  styleUrls: ['./lineage-tree.component.css']
})
export class LineageTreeComponent implements OnInit {

  //트리 생성 부분
  title = '바이너리 트리';
  type = ChartType.OrgChart;
  data: any = [
    ['회원', '추천인']
  ];
  options = {
    allowHtml: true,
    nodeClass: 'treeNodeClass',
    selectedNodeClass: 'selectedTreeNodeClass',
  }
  userInfoList: UserInfoProductVO[];  //전체 유저 정보 목록
  userProductList: ProductVO[] = [];  //전체 상품 정보 목록

  selectedNode: any  //선택한 노드(this.data)
  selectNodeObj: UserInfoProductVO | any; //선택한 노드 객체 == 나의 상품 컴포넌트의 데이터(.produts)

  loginUserId: string = 'admin';  //로그인한 유저 아이디
  viewUserId: string  //보이는 유저 아이디
  viewUserObj: UserInfoProductVO | any;  //보이는 유저 객체
  viewUserInput: string;  //input태그

  swapButton: boolean;
  modificationButton: boolean;

  total: number[] = [0, 0, 0];  //모든 유저 합 [USD, BTC, reward]
  adminInitFinish: boolean = false;

  percent: number[] = [0.05, 0.04, 0.03, 0.02, 0.01]  //세대별 보상 퍼센트
  sum: number[][] = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];  //세대별 상품구매 총합 [USD, BTC]
  tableUserList: UserInfoProductVO[][] | any = [[], [], [], [], []];  //세대별 회원 목록


  constructor(private userInfoService: UserInfoService, private porductService: UserPorductMyService,) {
    this.userInfoList = [];
    this.selectNodeObj = new UserInfoProductVO();

    this.viewUserId = this.loginUserId;
    this.viewUserInput = this.viewUserId;

    this.swapButton = false;
    this.modificationButton = false;
  }


  ngOnInit() {
    this.userInfoService.getUserInfos2().subscribe(async response => {  //데이터 호출
      this.userInfoList = response;
      this.userProductList = await this.porductService.getUserProducts();
      this.addProductsToUserInfo();  //UserInfo + Products
      this.resetDragPosition();

      if (this.loginUserId == "admin") {
        this.adminInitFinish = false
        this.productTotalCoin();  //모든 유저의 매출액 합
        this.totalReward();  //모든 유저의 보상 합
        this.adminInitFinish = true;
        this.drawTreeByFor(this.viewUserId, 10);

      } else {
        this.drawTreeByFor(this.viewUserId, 5);
      }
    });
  }

  /**
     * 회원정보(UserInfoProductVO)에 상품정보(products: ProductVO)를 저장
     * 현재 1000개의 유저 정보를 사용하여 유저 정보와 상품 목록 정보가 일치하지 않음.
     */
  addProductsToUserInfo() {
    for (let i = 0; i < this.userInfoList.length; i++) {
      let p = this.userProductList.filter(element => element.USER_ID == this.userInfoList[i].USER_ID);
      this.userInfoList[i].products = p;
    }
  }

  /*
   * admin 관련 실행
   */


  /**
   * 모든 회원의 매출액의 합을 계산하는 메소드
   */
  productTotalCoin() {
    this.total[0] = 0;
    this.total[1] = 0;

    this.adminInitFinish = false;
    for (let i = 0; i < this.userProductList.length; i++) {
      if (this.userProductList[i].PRODUCT_STATE == "G" || this.userProductList[i].PRODUCT_STATE == "P") {
        this.total[0] += Number(this.userProductList[i].CRT_USD);  //USD
        this.total[1] += Number(this.userProductList[i].ST_COIN);  //BTC
      }
    }
    this.adminInitFinish = true;
  }


  /**
   * 모든 회원의 보상액의 합을 계산하는 메소드
   * 매출액을 계산하는 코드가 제외될 예정
   */
  totalReward() {
    this.total[2] = 0;

    for (let i = 0; i < this.userInfoList.length; i++) {
      this.fiveThGeneration(this.userInfoList[i].USER_ID, false)  //세대별 상품구매 총합 계산
      this.userInfoList[i].reward = this.calReward();  //계산해서 저장필요

      this.total[2] += Number(this.userInfoList[i].reward) || 0;
      this.total[2] = Number(this.total[2].toFixed(8))

      // 제거 예정) 매출액을 저장하는 코드
      this.userInfoList[i].USDTotal = this.getMyProductTotalCoin(this.userInfoList[i].products, "CRT_USD", 1).toString();
      this.userInfoList[i].BTCTotal = this.getMyProductTotalCoin(this.userInfoList[i].products, "ST_COIN", 1).toString();
    }
  }

  //5대까지 접근하는
  //여기서 세대별 덧셈을 다해서 배열에 저장
  fiveThGeneration(USER_ID: string, isTable: boolean) {
    let userIdList: string[][] = [[USER_ID]]; //ID
    this.sum = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];;
    this.tableUserList = [[], [], [], [], []];

    let rootObj = this.userInfoList.find(element => element.USER_ID == USER_ID);  //매개변수로 받은 회원이 조회
    if (rootObj == undefined) return;  //없는 회원일 경우


    for (let userIdListIndex = 0; userIdListIndex < 5; userIdListIndex++) {
      if (userIdList[userIdListIndex + 1] == undefined) userIdList[userIdListIndex + 1] = [];

      let temp = this.userInfoList.filter(value => userIdList[userIdListIndex].indexOf(value.REC_USER) != -1)  //해당 아이디가 추천인인 회원들

      for (let tempIndex = 0; tempIndex < temp.length; tempIndex++) {
        userIdList[userIdListIndex + 1].push(temp[tempIndex].USER_ID)

        if (temp[tempIndex].USDTotal == undefined)  //USD 저장
          temp[tempIndex].USDTotal = this.getMyProductTotalCoin(temp[tempIndex].products, "CRT_USD", 1).toString();
        this.sum[0][userIdListIndex] += Number(temp[tempIndex].USDTotal);


        if (temp[tempIndex].BTCTotal == undefined) //BTC 저장
          temp[tempIndex].BTCTotal = this.getMyProductTotalCoin(temp[tempIndex].products, "ST_COIN", 1).toString();
        this.sum[1][userIdListIndex] += Number(temp[tempIndex].BTCTotal);
        this.sum[1][userIdListIndex] = Number(this.sum[1][userIdListIndex].toFixed(8));

        if (isTable)
          this.tableUserList[userIdListIndex].push(temp[tempIndex])
      }
    }
  }


  //트리 그리기 반복문으로 변경 
  drawTreeByFor(USER_ID: string, limit: number) {
    let userIdList: string[][] = [[USER_ID]]; //ID
    this.data = [];

    if (USER_ID == "admin") {
      this.data.push([{ v: USER_ID, f: this.createDirHTML(USER_ID) }, ''])

    } else {
      let rootObj = this.userInfoList.find(element => element.USER_ID == USER_ID);  //보여질 유저를 루트로
      if (rootObj == undefined) return;  //없는 유저일 경우


      this.fiveThGeneration(rootObj.USER_ID, false)  //세대별 상품구매 총합 계산
      rootObj.reward = this.calReward();  //보상 계산해서 저장
      this.data.push([{ v: USER_ID, f: this.createNodeHtml(rootObj) }, ''])
    }

    for (let userIdListIndex = 0; userIdListIndex < limit; userIdListIndex++) {
      if (userIdList[userIdListIndex + 1] == undefined) userIdList[userIdListIndex + 1] = [];

      var indexList: number[] = [];
      let temp = this.userInfoList.filter((value): boolean => {  //해당 아이디가 추천인인 회원들
        let index = userIdList[userIdListIndex].indexOf(value.REC_USER);  //찾으면 index, 존재하지 않으면 -1 리턴
        if (index != -1)
          indexList.push(index);
        return index != -1
      })

      Array.from(new Set(indexList)).forEach(indexItem => {  //하위 멤버가 있는 경우 LEFT, RIGHT 표시
        this.data.push([{ v: "L!" + userIdList[userIdListIndex][indexItem], f: this.createDirHTML("LEFT") }, userIdList[userIdListIndex][indexItem]])
        this.data.push([{ v: "R!" + userIdList[userIdListIndex][indexItem], f: this.createDirHTML("RIGHT") }, userIdList[userIdListIndex][indexItem]])
      })

      for (let tempIndex = 0; tempIndex < temp.length; tempIndex++) {
        userIdList[userIdListIndex + 1].push(temp[tempIndex].USER_ID)

        this.fiveThGeneration(temp[tempIndex].USER_ID, false)  //세대별 상품구매 총합 계산
        temp[tempIndex].reward = this.calReward();  //보상 계산해서 저장

        this.data.push([{ v: temp[tempIndex].USER_ID, f: this.createNodeHtml(temp[tempIndex]) }, temp[tempIndex].REC_DIR + "!" + userIdList[userIdListIndex][indexList[tempIndex]]])
      }
    }
  }


  //10대까지 접근하는
  tenThGeneration(USER_ID: string) {

  }


  //상품의 총합(매출액)을 계산해주는 메소드
  //type: ST_COIN, CRT_USD
  //contition: 1(G,P), 2(G)
  getMyProductTotalCoin(products: ProductVO | any, type: string, condition: number) {
    if (products == undefined) return 0;
    let sum = 0;
    for (let i = 0; i < products.length; i++) {
      if (condition == 1) {
        if (products[i].PRODUCT_STATE == "G" || products[i].PRODUCT_STATE == "P")
          sum += Number(products[i][type]);

      } else if (condition == 2) {
        if (products[i].PRODUCT_STATE == "G")
          sum += Number(products[i][type]);
      }
    }
    return Number(sum.toFixed(8));
  }


  /**
   * fiveThGeneration 호출 이후 사용
   * 한 회원의 보상 계산
   */
  calReward() {
    let reward = 0;
    for (let j = 0; j < this.percent.length; j++) {
      reward += Number((this.sum[1][j] * this.percent[j]).toFixed(8));
    }
    return reward.toFixed(8);
  }


  //리니지 트리에서 일반 노드 HTML 형식
  createNodeHtml(obj: UserInfoProductVO): string {
    return `<div class="pb-2 myTooltip">
      <img class="mb-1" src="assets/images/node.png" /><br>
      <span class="p-1" style="border: 2px solid rgb(165, 181, 198);border-radius: 10px;">`+ obj.USER_ID + `</span>
      <div class="myTooltiptext">
        <div class="card" style="width: 16rem;">
          <div class="card-body">
            <div class="row border-bottom">
              <div class="col-3 text-left p-2">
                <img class="mb-1" src="assets/images/node.png" style="zoom:90%" /><br>
              </div>
              <div class="col text-left p-2">
                <div class="myTooltiptextBold">`+ obj.USER_ID + `</div>
                <div>가입일 : `+ obj.REG_DATE + `</div>
              </div>
            </div>
            <div class="row border-bottom">
              <div class="col p-2">
                <span class="text-muted">총 매출액</span>
                <div class="myTooltiptextBold m-1">`+ this.getMyProductTotalCoin(obj.products, 'CRT_USD', 1).toFixed(2) + ` USD</div>
                <div class="myTooltiptextBold m-1">`+ this.getMyProductTotalCoin(obj.products, 'ST_COIN', 1).toFixed(8) + ` BTC</div>
              </div>
            </div>
            <div class="row">
              <div class="col p-2">
                <span class="text-muted">총 보상</span>
                <div class="myTooltiptextBold m-1">`+ obj.reward + ` BTC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`
  }

  //리니지 트리에서 LEFT, RIGHT 노드 HTML 형식
  createDirHTML(DIR: string) {
    return `<span class="dirNode">` + DIR + `</span>`;
  }

  //노드를 선택했을 때
  selectNode(event: ChartSelectionChangedEvent) {
    let selectedNodeRow;  //선택한 노드 열번호
    let selectedUserId: any;  //선택한 노드 아이디

    if (event.selection[0] != null) {  //선택 했을 때
      selectedNodeRow = event.selection[0].row || 0;
      this.selectedNode = this.data[selectedNodeRow];
      selectedUserId = this.selectedNode[0].v;

      if (selectedUserId.search("!") == 1 || selectedUserId == "admin") {  //LEFT, RIGHT를 선택했을 때
        this.selectNodeObj = new UserInfoProductVO();
        this.sum = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];;
        this.tableUserList = [[], [], [], [], []];

      } else {
        this.selectNodeObj = this.userInfoList.find((element: any) => element.USER_ID == selectedUserId);
        this.fiveThGeneration(selectedUserId, true)
      }

    } else {
      this.selectNodeObj = new UserInfoProductVO();
      this.sum = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];;
      this.tableUserList = [[], [], [], [], []];
    }
  }


  /**
   * 보여지는 회원 변경
   */
  changeViewUser() {
    if (this.viewUserInput == "admin") {
      this.viewUserId = this.viewUserInput;
      this.productTotalCoin();
      this.totalReward();
      this.drawTreeByFor(this.viewUserId, 10);

    } else if (this.userInfoList.find(element => element.USER_ID == this.viewUserInput) != undefined) {
      this.viewUserId = this.viewUserInput;
      this.drawTreeByFor(this.viewUserId, 5);

    } else {
      alert("없는 사용자입니다.")
    }

    this.resetDragPosition();
    this.selectNodeObj = new UserInfoProductVO();
    this.sum = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];;
    this.tableUserList = [[], [], [], [], []];
  }


  dragPosition = { x: 0, y: 0 };  //트리 드래그 위치
  /**
   * '트리 처음 위치로' 버튼을 누를 경우 트리 위치를 0,0으로 변경
   */
  resetDragPosition() {
    this.dragPosition = { x: 0, y: 0 };
  }
}