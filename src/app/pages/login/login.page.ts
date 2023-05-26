import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import {AuthServiceService} from 'src/app/services/auth-service/auth-service.service'
import { DairyServiceService } from 'src/app/services/dairy-service/dairy-service.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
// import { HomePage } from '../tabs/home/home.page.ts';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  type: boolean = true;
  isLogin = false;

  constructor(
    private router: Router, 
    private global: GlobalService,
    private authService: AuthServiceService,
    private dairyService: DairyServiceService,
    private profileService: ProfileService
    // private homePage: HomePage
  ) { }

  ngOnInit() {
  }

  changeType() {
    this.type = !this.type;
  }


  onSubmit(form: NgForm) {
    console.log(form);
    if(!form.valid) return;
    this.login(form);
  }


  async login(form) {
    this.isLogin = true;
    // this.router.navigateByUrl('/tabs');
    this.isLogin = false;
    
    
    await this.authService.login(form.value.email,form.value.password).then(data => {
        console.log('data',data);
        if (data?.u_id){
          this.authService.currentStorage(data.u_id);
          this.dairyService.getAddresses();
          this.profileService.getProfile();
          this.router.navigateByUrl('/tabs');
        }else {
          let msg: string = 'Could not sign you in, please try again.';
            // if(e.code == 'auth/user-not-found') msg = 'E-mail address could not be found';
            // else if(e.code == 'auth/wrong-password') msg = 'Please enter a correct password';
          this.global.showAlert(msg);
        }
        form.reset();
        // this.router.navigateByUrl('/tabs');
        // this.isLogin = false;
        // form.reset();
    })
    .catch(e => {
      console.log(e);
      this.isLogin = false;
      let msg: string = 'Could not sign you in, please try again.';
      if(e.code == 'auth/user-not-found') msg = 'E-mail address could not be found';
      else if(e.code == 'auth/wrong-password') msg = 'Please enter a correct password';
      this.global.showAlert(msg);
      form.reset();
    })
  }
  

}



    
      // this.profileService.getProfile().then(_prof => {
      //   console.log('prpr',_prof.type);
      //   if (_prof.type == 'admin'){
      //     this.navigate('/admin');
      //   }else {
      //     this.navigate('/tabs');
      //   }
      //   this.isLogin = false;
      // })
      // console.log('data',data);
   
    