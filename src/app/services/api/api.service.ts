import { Injectable } from '@angular/core';
import { Memo } from 'src/app/models/memo.model';
import { Storage } from '@capacitor/storage';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import * as geofirestore from 'geofirestore';
import firebase from 'firebase/compat/app';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  firestore = firebase.firestore();
  GeoFirestore = geofirestore.initializeApp(this.firestore);

  dairies: Memo[] =[];

  constructor(
    private adb: AngularFirestore
  ) { }

  collection(path, queryFn?){
    return this.adb.collection(path, queryFn);
  }

  geoCollection(path) {
    return this.GeoFirestore.collection(path);
  }

  async getCurrentID():Promise<string>{
    console.log('get current id test')
    const current_id = await Storage.get({ key: 'currentID' })

    console.log('get current id end test', current_id.value)
    const id = JSON.parse(current_id.value) || "";
    console.log('get id end test', id)
    return id;
  }

  getMemo():Memo[]{
    const _memos = this.memos;
    return _memos;

  }

  async loadMemo(){
    console.log('loadMemo')

    const id = await this.getCurrentID();
    // console.log('loadMemo w id', id)

    // .doc('125715478').get().toPromise())).data()
    // let dairyList: any  = await (await (this.collection('memos').doc(id).collection('allmemos').pipe(
    //   switchMap(async(data: any) => {
    //     let restaurantData = await data.docs.map(element => {
    //       const item = element.data();
    //       return item;
    //     });
    //     console.log(restaurantData);
    //     return restaurantData;
    //   })
    // ).toPromise();


    let dairyList: any  = new Promise<any>((resolve)=> {
      this.collection('memos').valueChanges(id).subscribe(users => resolve(users));
    })


    console.log('me',dairyList);

    // return (await ()).data();


    // const dairyList = await Storage.get({ key: id });
    // this.dairies = JSON.parse(dairyList.value) || [];





    return this.dairies;

  }

  async getfbMemo(){
    try {
      const id = await this.getCurrentID();
      const restaurants = await this.collection('memos').doc(id).get().pipe(
        switchMap(async(data: any) => {
          let restaurantData = await data.docs.map(element => {
            const item = element.data();
            return item;
          });
          console.log(restaurantData);
          return restaurantData;
        })
      ).toPromise();
      console.log(restaurants);
      return restaurants;
    } catch(e) {
      throw(e);
    }
  }


  async addMemo(data:Memo, id: string){


    try {
      let memo: any = Object.assign({}, data);
      
      console.log(memo);
      
      const response = await this.collection('memos').doc(id).collection('allmemos').doc(data.m_id).set(memo);
      console.log('response', response)
      return this.dairies;
    } catch(e) {
      throw(e);
    }
    
    //previous
    // await this.loadMemo();
    // this.dairies.push(data);
    
    // Storage.set({
    //   key: id,
    //   value: JSON.stringify(this.dairies),
    // });
    // console.log('containing:',this.dairies);
    // return this.dairies;

  }

  saveMemos(data:Memo[], id: string){

    Storage.set({
      key: id,
      value: JSON.stringify(data),
    });

  }

  async loadUser(uid){


    const userList = await Storage.get({ key: 'users' });
    const users = JSON.parse(userList.value);
    const check_user = users.filter(x => (x.u_id == uid));
    return check_user[0];
    // return users;
  }

  

  memos: Memo[] = [
  {
     m_id: '1',
     title: "A Mystory Day",
     date: "2022-04-05",
     content: "Keep close to Nature's heart... and break clear away, once in awhile, and climb a mountain or spend a week in the woods. Wash your spirit clean.",
     feeling: ["happy", "chill"]
  },
  {
    m_id: '2',
    title: "Lazy Me",
    date: "2022-04-06",
    content: "mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad",
    feeling: ["Sad", "Angry"]
 },
 {
  m_id: '3',
  title: "Chill",
  date: "2022-04-07",
  content: "mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad mad",
  feeling: ["Sad", "Angry"]
}
]
}
