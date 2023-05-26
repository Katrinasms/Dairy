import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isLoading: boolean = false;

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl:AlertController,
    private loadingCtrl: LoadingController
  ) { }

  async showToast(msg, color, position, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position
    });
    toast.present();
  }

  errorToast(msg?, duration = 4000) {
    this.showToast(msg ? msg : 'No Internet Connection', 'danger', 'bottom', duration);
  }

  showAlert(message: string, header?, buttonArray?,inputs?){
    this.alertCtrl.create({
     header:header ? header: 'Authentication failed',
     message: message,
     inputs: inputs ? inputs : [],
     buttons:buttonArray ? buttonArray:['Okay']
   })
   .then(alertE1 => alertE1.present());
 }

 successToast(msg) {
  this.showToast(msg, 'success', 'bottom');
}

showLoader(msg?, spinner?){
  // this.isLoading = true;
  if(!this.isLoading) this.setLoader();
  return this.loadingCtrl.create({
    message: msg,
    spinner: spinner ? spinner : 'bubbles'
  }).then(res => {
    res.present().then(() => {
      if(!this.isLoading) {
        res.dismiss().then(() => {
          console.log('abort presenting');
        });
      }
    })
  })
  .catch(e => {
    console.log('show loading error: ', e);
  });
}

hideLoader() {
  // this.isLoading = false;
  if(this.isLoading) this.setLoader();
  return this.loadingCtrl.dismiss()
  .then(() => console.log('dismissed'))
  .catch(e => console.log('error hide loader: ', e));
}

setLoader() {
  this.isLoading = !this.isLoading;
}

}
