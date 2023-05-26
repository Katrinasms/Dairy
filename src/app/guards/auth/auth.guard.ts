import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ){

  }

  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean>  {
      // const roleType = route.data.type;
      try{
        const id = await this.authService.loadId();
        console.log('id', id);
        if(id != '' && id) {
          return true;
        } else {
          this.checkForAlert();
        }
      } catch(e){
        console.log(e);
        this.checkForAlert();
      }
  }

//JSON.parse(current_id.value) 

  async checkForAlert() {
    const id = await this.authService.loadId();
    if(id) {
      // check network
      console.log('alert: ', id);
    } else {
      this.authService.logout();
      // this.navigate('/login');
    }
  }

  navigate(url) {
    this.router.navigateByUrl(url, {replaceUrl: true});
    return false;
  }
}
