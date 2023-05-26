import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { DairyServiceService } from 'src/app/services/dairy-service/dairy-service.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  isLoading: boolean = false;

  constructor(private router: Router, private global: GlobalService, private authService: AuthServiceService,
    private dairyService: DairyServiceService,
    private profileService: ProfileService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if(!form.valid) return;
    this.register(form);
  }



    // public u_id: string,
    // public name: string,
    // public email: string,
    // public password: string,
    
  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  register(form: NgForm) {
    this.isLoading = true;
    console.log(form.value);
    
    const _user = new User (
      this.randomString(),
      form.value.name,
      form.value.email,
      form.value.password,
      'GrapeNuts',
      'pink'
    )
    this.authService.register(_user).then(_data => {
      console.log("data: id", _data);
      this.authService.currentStorage(_data);
      this.dairyService.getAddresses();
      this.profileService.getProfile();
      const navData: NavigationExtras = {
        queryParams: {
          id: JSON.stringify(_data)
        }
      }
      // this.router.navigateByUrl('/tabs');
      this.router.navigate(['/tabs/home'], navData);
      this.isLoading = false;
      form.reset();
    })
    .catch(e => {
      console.log(e);
      this.isLoading = false;
      let msg: string = 'Could not sign you up, please try again.';
      if(e.code == 'auth/email-already-in-use') {
        msg = e.message;
      }
      this.global.showAlert(msg)
    });
  }

  


}
