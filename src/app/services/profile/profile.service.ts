import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ApiService } from '../api/api.service';
import { AuthServiceService } from '../auth-service/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private authService:AuthServiceService,
    private apiService: ApiService
  ) { }
  
  private _profile = new BehaviorSubject<User>(null);

  get profile() {
    return this._profile.asObservable();
  }

  async getProfile() {
    try {
      const uid = await this.authService.loadId();
      console.log('uid', uid);

      let profile: any = await this.authService.getUserData(uid);
      // let profile: any = await this.apiService.loadUser(uid);

      console.log('profile2: ', profile);
      const data = new User(
        uid,
        profile.name,
        profile.email,
        profile.password,
        profile.font,
        profile.theme
      );
      this._profile.next(data); 
      this.initialSetting(profile.font,profile.theme)
      return data;
    } catch(e) {
      throw(e);
    }
   

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

  async getfontcolor(){
    let _pro:User = await this.getProfile() as User;
    let color = _pro.theme;
    let font = _pro.font;
    return{color: color, font: font};

  }

  async getProfileRef(query?) {
    // if(!this.uid)
    // await this.getID();
    const uid = await this.authService.loadId();
    console.log('getaddressRef, this uid', uid);
    return await this.apiService.collection('users').doc(uid);
  }

  // profile, param
  async updateProfileColor(color) {
    try {
      const uid = await this.authService.loadId();
      const result = await (await this.apiService.collection('users').doc(uid).get().toPromise()).data() as User;
      console.log('uid:', uid);
      console.log('result:', result);
      const data = new User(
        result.u_id,
        result.name,
        result.email,
        result.password,
        result.font,
        color
      );
      let profileData = Object.assign({}, data);
      await (await this.getProfileRef()).update(profileData);
      console.log("data",profileData);
      // this._profile.next(data);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async updateProfileFont(font) {
    try {
      const uid = await this.authService.loadId();
      const result = await (await this.apiService.collection('users').doc(uid).get().toPromise()).data() as User;
      console.log('uid:', uid);
      console.log('result:', result);
      const data = new User(
        result.u_id,
        result.name,
        result.email,
        result.password,
        font,
        result.theme
      );
      let profileData = Object.assign({}, data);
      await (await this.getProfileRef()).update(profileData);
      console.log("data",profileData);
      // this._profile.next(data);
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }
//   constructor(
//     public u_id: string,
//     public name: string,
//     public email: string,
//     public password: string,

// public u_id: string,
// public name: string,
// public email: string,
// public password: string,
// public font?: string,
// public theme?: string
    
// ) {}


}
