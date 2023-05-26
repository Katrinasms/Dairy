import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {

  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private auth: AuthServiceService, 
    private global: GlobalService
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    if(!form.valid) return;
    this.isLoading = true;
    this.auth.resetPassword(form.value.email).then(() => {
      // console.log(data);      
      this.global.successToast('Reset Password Link is sent to your Email Address');
      this.isLoading = false;
      this.navCtrl.back();
    })
    .catch(e => {
      console.log(e);   
      this.isLoading = false;
      this.global.showAlert('Something went wrong');
    });
  }

}
