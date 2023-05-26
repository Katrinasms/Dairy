import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Memo } from 'src/app/models/memo.model';
import { ApiService } from 'src/app/services/api/api.service';
import { DairyServiceService } from 'src/app/services/dairy-service/dairy-service.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{

 
  isLoading: boolean;
  memosSub: Subscription;
  uid:string;

  memos: Memo[] = [];
  constructor(
    private apiService: ApiService,
    private router: Router,
    private dairyService: DairyServiceService,
    private global: GlobalService,
    private route: ActivatedRoute) {}


  async ngOnInit(){
    
    // await this.apiService.loadMemo();
    this.global.showLoader();
    this.getID();
    await this.dairyService.getAddresses();

    this.memosSub = this.dairyService.memos.subscribe(memo => {
      console.log('memo: ', memo);
      this.memos = memo;
    });
    this.global.hideLoader();
    
    
    // this.getAddresses();
  }

  async ionViewWillEnter() {
    // console.log('hi')
    // this.isLoading = true;
    // // await this.dairyService.getAddresses();
    // // await this.ngOnInit();
    // this.isLoading = false;
    // console.log('bye')
    
    // todo
}

  // async viewDidLoad(){
  //   await this.apiService.loadMemo();
  //   await this.dairyService.getAddresses();
  //   this.ngOnInit();
  //   console.log('view did load')

  // }

  getID(){
    const data = this.route.snapshot.queryParams;
    if(data?.id){
      const id = JSON.parse(data.id);
      console.log('id:', id);
      this.uid = id;
      // if(memo12){
      //   this.memos = memo12
        
      // // }
      // this.dateTime = memo12.date;
      // this.initForm(memo12);
      // this.id = memo12.m_id;
      // console.log(this.id);
      
     

    }else {
      // this.dateTime = new Date().toISOString().substring(0, 10);
      // this.initForm();
    }
  }

  async getAddresses() {    
    // this.isLoading = true;
    // this.global.showLoader();
    this.dairyService.getMemos();
    // setTimeout(async () => {
    //   await this.dairyService.getMemos();
    //   console.log(this.memos);
    //   // this.isLoading = false;
    //   // this.global.hideLoader();
    //   // this.global.setLoader();
    // }, 30);
  }

  editing(memo){
    console.log('edit',memo)
    const navData: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(memo)
      }
    }
    this.router.navigate(['tabs','dairy-content', memo.m_id.toString()], navData);
    // 
  
  }

  deleting(memo){
    console.log('delete:', memo);
    this.global.showAlert(
      'Are you sure you want to delete this memo?',
      'Confirm',
      [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('cancel');
            return;
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            // this.global.showLoader();
            await this.dairyService.deletememos(memo,this.uid);
            // this.global.hideLoader();
          }
        }
      ]
    )
  }


 
  navigate() {
    this.router.navigate(['tabs','dairy-content','1']);
  }

  ngOnDestroy(){
    if(this.memosSub) this.memosSub.unsubscribe();
    console.log("ngonDestroy")
  }


}
