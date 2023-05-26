import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { User } from 'src/app/models/user.model';
import { LoginPage } from 'src/app/pages/login/login.page';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  users: User[];

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth, 
    private adb: AngularFirestore,
    private apiService: ApiService
  ) { }

  async loadUser(){
    const userList = await Storage.get({ key: 'users' });
    this.users = JSON.parse(userList.value) || [];
    return this.users;
  }

  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  updateProfile(){
    //
  }

  async register(data:User){
    const registeredUser = await this.fireAuth.createUserWithEmailAndPassword(data.email, data.password);
    console.log('registered user:', registeredUser);
    
    const _user = new User (
      registeredUser.user.uid,
      data.name,
      data.email,
      data.password,
      'GrapeNuts',
      'pink'
    )
    
    await this.apiService.collection('users').doc(registeredUser.user.uid).set(Object.assign({}, _user));

    return registeredUser.user.uid

    //previous code
    // const userList = await this.loadUser();
    // const u_id = this.randomString();
    // const _user = new User (
    //   u_id,
    //   data.name,
    //   data.email,
    //   data.password,
    //   'font',
    //   'pink'
    // )
    // userList.push(_user);
    // Storage.set({
    //   key: 'users',
    //   value: JSON.stringify(userList),
    // });
    // this.currentStorage(u_id)
    // return u_id;


  }

  async resetPassword(email: string){
    // return await email;
    try{
      await this.fireAuth.sendPasswordResetEmail(email);
    }catch(e){
      throw(e);
    }
  }

  async currentStorage(id){
    Storage.set({
      key: 'currentID',
      value:  JSON.stringify(id),
    });
    console.log('currentStorage set!', id);
  }

  async loadId(){
    return JSON.parse((await Storage.get({ key: 'currentID' })).value);
  }

  async login(email, pw){
     //check against the database to see if there is any pair of it

     try {
      const response = await this.fireAuth.signInWithEmailAndPassword(email, pw);
      console.log('response',response);
      if(response.user) {
        this.currentStorage(response.user.uid);
        const user: any = await this.getUserData(response.user.uid);
        return user;
      }
      // return response;
    } catch(e) {
      throw(e);
    }
    //previous
    // try{
    //   const userList = await this.loadUser();
    //   console.log('login_load user place:',userList);
    //   const check_user = userList.filter(x => (x.email == email && x.password == pw));
    //   return check_user[0];
    // }catch (e){
    //   console.log(e);
    // }
    //end of previous
  }

  async logout(){
    await this.fireAuth.signOut();
    console.log('hi, i would like to logout')
    this.currentStorage('');
    // await Storage.remove({key:'currentID'});
    this.router.navigateByUrl('/login');

    //unscribe
  }

  async getUserData(id) {
    return (await (this.apiService.collection('users').doc(id).get().toPromise())).data();
  }
   
    
}
