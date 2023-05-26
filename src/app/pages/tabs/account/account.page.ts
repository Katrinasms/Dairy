import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage {

  isLoading:boolean;
  profile:User = {
    u_id: '123445',
    name: "Katrina",
    email: 'katrina@gmail.com',
    password: "1",
    font: "GrapeNuts",
    theme: "pink"
    // photo: "assets/imgs/02.jpeg"
  }
  colors = [
    'pink',
    'blue',
    'purple'
  ]
  fonts = [
    'GrapeNuts',
    'Varela'
  ]

  customPopoverOptions: any = {
    header: 'Hair Color',
    subHeader: 'Select your hair color',
    message: 'Only select your dominant hair color'
  };

  myKey = 'brown';
  default_fonts = 'GrapeNuts';
  default_color = 'pink';

  profileSub: Subscription;
  
  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private profileService: ProfileService,
    private global: GlobalService
  ) {}

  async ngOnInit(){
    // this.default_fonts = 'GrapeNuts';
    this.global.showLoader();
    let _profile:User = await this.getData();
    console.log(_profile)
    this.profileSub = await this.profileService.profile.subscribe(profile => {
      console.log('hi1');
      this.profile = profile;
      this.default_fonts = profile.font
      
      // this.default_fonts = profile.font;
      // this.default_color = profile.theme;
      // if(this.profile.font != null){
  
      // }
      // this.setDefaultValue();
      
    });
    this.default_fonts = _profile.font;
    this.default_color = _profile.theme;
    console.log(this.default_fonts,this.default_color);
    this.initialSetting(this.default_fonts,this.default_color);
    this.global.hideLoader();
    
    // // setTimeout(() => {
    //   await 
    // // }, 100);
   
    
  }


  

  setDefaultValue(){
    this.default_fonts = this.profile.font;
    console.log('font set.')
  }

  initialSetting(font,color){
    if (color == "blue"){
      document.documentElement.style.setProperty('--ion-color-primary',"#146ca4") ;
      
      // document.documentElement.style.setProperty(' --ion-background-color',"#242444") ;
    } else if (color == "purple"){
      document.documentElement.style.setProperty('--ion-color-primary',"#CDB6F6") 
    } else {
      document.documentElement.style.setProperty('--ion-color-primary',"#FEDBD0") ;
    }

    document.documentElement.style.setProperty('--ion-font-family', font)

  }


  changeInColorSelection(){
    console.log("changed!")
    console.log(this.default_color);
    if (this.default_color == "blue"){
      document.documentElement.style.setProperty('--ion-color-primary',"#146ca4") ;
      
      // document.documentElement.style.setProperty(' --ion-background-color',"#242444") ;
    } else if (this.default_color == "purple"){
      document.documentElement.style.setProperty('--ion-color-primary',"#CDB6F6") 
    } else {
      document.documentElement.style.setProperty('--ion-color-primary',"#FEDBD0") ;
    }

    this.profileService.updateProfileColor(this.default_color);

    //update profile in database

    // change personal data in database
    console.log('done change')
  }

  changeInFontSelection(){
    console.log("changed!")
    console.log(this.default_fonts);
    document.documentElement.style.setProperty('--ion-font-family', this.default_fonts) ;
    this.profileService.updateProfileFont(this.default_fonts);
    // const el = document.querySelector<HTMLElement>('ion-title');
    // el.style.setProperty('--ion-font-family', this.default_fonts);
    console.log('done change')
  }


  logout(){
    console.log("hi")
    this.authService.logout(); 
  }

  getData(){
    return this.profileService.getProfile();
  }

  ngOnDestroy(){
    if(this.profileSub) this.profileSub.unsubscribe();
  }

  async ionViewWillEnter() {
    
    let _color_font = this.profileService.getfontcolor();
    this.default_color = (await _color_font).color;
    this.default_fonts = (await _color_font).font;
   
    
  }

//   async ionViewWillEnter() {
//     // console.log('hi')
//     // this.isLoading = true;
//     // // await this.ngOnInit();
//     // this.isLoading = false;
//     // console.log('bye')
    
//     // todo
// }
  
  

}
