import { Component, OnInit, ɵɵpureFunction1 } from '@angular/core';
// import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Memo } from 'src/app/models/memo.model';
import { ApiService } from 'src/app/services/api/api.service';
import { DairyServiceService } from 'src/app/services/dairy-service/dairy-service.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dairy-content',
  templateUrl: './dairy-content.page.html',
  styleUrls: ['./dairy-content.page.scss'],
})
export class DairyContentPage implements OnInit {
  form: FormGroup;
  dateTime:string;
  feelings: string[] = [];
  feeling: string;
  isLoading: boolean = false;
  memos:Memo;
  id: any;
  uid: string;
  

  constructor(
    private global: GlobalService,
    private apiService: ApiService,
    private navCtrl: NavController,
    private dairyService: DairyServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.getID();
    this.checkForUpdate();
  }

  async getID(){
    this.uid = await this.apiService.getCurrentID();
  }


  initForm(memos?){  
    let data = {
      title: null,
      content: null,
      feeling: null
    };
    if (memos){
      data = {
        title: memos.title,
        content: memos.content,
        feeling: memos.feeling
      };
      this.feelings = memos.feeling;
    }
    this.formData(data);
    this.isLoading = false;
  }

  formData(data){
    this.form = new FormGroup({
      title: new FormControl(data.title,{validators:[Validators.required]}),
      content: new FormControl(data.content,{validators:[Validators.required]}),
      feeling: new FormControl(data.feeling)
    })
  }

  async checkForUpdate(){
    const data = this.route.snapshot.queryParams;
    if(data?.data){
      const memo12 = JSON.parse(data.data);
      console.log('data:', memo12);
      // if(memo12){
      //   this.memos = memo12
        
      // }
      this.dateTime = memo12.date;
      this.initForm(memo12);
      this.id = memo12.m_id;
      console.log(this.id);
      
     

    }else {
      this.dateTime = new Date().toISOString().substring(0, 10);
      this.initForm();
    }



  }
   


  addCategory() {
    console.log(this.feeling);
    if(this.feeling.trim() == '') return;
    const checkString = this.feelings.find(x => x == this.feeling);
    if(checkString) {
      this.global.errorToast('Category already added');
      return;
    }
    this.feelings.push(this.feeling);
  }

  clearCategory() {
    this.feelings = [];
  }

  getArrayAsString(array) {
    return array.join(', ');
  }

  // onSubmit(form: NgForm) {


  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  // async addDairy(form: NgForm) {
    async addDairy() {

      // this.isLoading = true;
      console.log(this.form.value);
      //previous
      // const id = this.randomString();
      const memos = new Memo(
        
        this.form.value.title,
        this.dateTime,
        this.form.value.content,
        this.feelings,
        // id
      );
      console.log('Memo1234',memos);
      await this.dairyService.addMemos(memos, this.uid);
      console.log('Memo',memos);
      //end previous

  }

  // onSubmit() {
  //   if(!this.form.valid) return;
  //   // this.addDairy(form);
  //   this.addDairy();
  //   // else this.global.errorToast('Please select address for this restaurant');
  // }

  async onSubmit() {
    try {
      // this.toggleSubmit();
      console.log(this.form);
      if(!this.form.valid 
        // || !this.isLocationFetched
        ) {
        // this.toggleSubmit();
        return;
      }
      const data = {
        title: this.form.value.title,
        content: this.form.value.content,
        feeling: this.feelings,
        date:this.dateTime
      };

      console.log('memo1: ', data);
      console.log('id', this.id);
      if (!this.id) await this.addDairy();
      // else await this.dairyService.updateDairy(this.id,data, this.uid); 
      else await this.dairyService.updateAddress(this.id,data); 

      // hehhehe
      // this.check = true;

      this.form.reset();
      this.clearCategory();
      this.isLoading = false;     
      //navigate?
      this.router.navigate(['/','tabs','home']);
      // this.navCtrl.back();  
    } catch(e) {
      console.log(e);
      this.global.errorToast();
    }
  }
}
