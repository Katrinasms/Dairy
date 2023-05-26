import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(
    private global: GlobalService, 
    private router: Router,
    private authService: AuthServiceService){}

    
  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {

      
      try {
        // this.global.showLoader();
        const val = await this.authService.loadId();
        console.log('value',val);
        if(val != "" && val) {
          this.router.navigateByUrl('/tabs', {replaceUrl:true});

          return false;
        } else {
          return true;
        }
        // this.global.hideLoader();
      } catch(e) {
        console.log(e);
        
        return true;
      }
  }
}
