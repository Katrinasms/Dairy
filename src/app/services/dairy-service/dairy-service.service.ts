import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Memo } from 'src/app/models/memo.model';
import { ApiService } from '../api/api.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DairyServiceService {

  uid:string;


  private _memos = new BehaviorSubject<Memo[]>([]);

  get memos(){
    return this._memos.asObservable();
  }

  async getID(){
    this.uid = await this.api.getCurrentID();
    // this.getMemos();
  } 

  randomString() {
    const id = Math.floor(100000000 + Math.random() * 900000000);
    return id.toString();
  }

  constructor(private api:ApiService) { }

  async getMemos(){
    const allmemo = await this.api.loadMemo();
    console.log('service page', allmemo);
    this._memos.next(allmemo);
    return allmemo;
  }

  async addMemos(data:Memo, id:string){
    // const memo = await this.api.addMemo(data, id);
    const _data = new Memo(
      data.title,
      data.date,
      data.content,
      data.feeling,
      '1'
    );
    let addressData = Object.assign({}, _data);
    const response = await (await this.getAddressRef()).add(addressData);
    console.log('response',response);
    const _data1 = new Memo(
      data.title,
      data.date,
      data.content,
      data.feeling,
      response.id
    );
    let addressData1 = Object.assign({}, _data1);
    await (await this.getAddressRef()).doc(response.id).update(addressData1);
    // delete addressData.mid;
    // public title: string,
    // public date: string,
    // public content: string,
    // public feeling: string[],


    const allmemos = await this.getAddresses();
    this._memos.next(allmemos);
  }

  // async updateDairy(id,param, uid){
  //   try{
  //     // await this.getMemos();
  //     await this.getAddresses();
  //     let currentMemos = this._memos.value;
  //     console.log("currentMemos",currentMemos);
  //     const index = currentMemos.findIndex(x => x.m_id == id);

  //     const data = new Memo(
  //       id,
  //       param.title,
  //       param.date,
  //       param.content,
  //       param.feeling,
  //     );
  //     currentMemos[index] = data;
  //     this.api.saveMemos(currentMemos, uid);
  //     this._memos.next(currentMemos);
  //   } catch(e){
  //     throw(e);
  //   }
  // }

  async deletememos(memo, uid){
    try {
      await (await this.getAddressRef()).doc(memo.m_id).delete();
      // await this.getMemos();
      let currentMemos = this._memos.value;
      currentMemos = currentMemos.filter(x => x.m_id != memo.m_id);
      // this.api.saveMemos(currentMemos, uid);
      this._memos.next(currentMemos);
    } catch(e) {
      throw(e);
    }
  }

  async getAddressRef(query?) {
    // if(!this.uid)
    await this.getID();
    console.log('getaddressRef, this uid', this.uid);
    return await this.api.collection('memos').doc(this.uid).collection('allmemos', query);
  }


  async getAddresses(limit?) {
    try {
      let addressRef;
      if(limit) addressRef = await this.getAddressRef(ref => ref.limit(limit));
      else addressRef = await this.getAddressRef();
      const allAddress: Memo[] = await addressRef.get().pipe(
        switchMap(async(data: any) => {
          let itemData = await data.docs.map(element => {
            let item = element.data();
            item.id = element.id;
            return item;
          });
          console.log(itemData);
          return itemData;
        })
      )
      .toPromise(); 
      console.log('alladdress',allAddress);
      let _allAddress = allAddress.sort((a, b) => b.date <= a.date ? -1 : 1)
      
      // this._memos = allAddress;
      this._memos.next(_allAddress);
      return _allAddress;
      
    } catch(e) {
      console.log(e);
      throw(e);
    }
  }

  async updateAddress(id,param){
    try{
      // await this.getAddresses() ;
      console.log('b4 ref', this._memos.value);
      
      await (await this.getAddressRef()).doc(id).update(param);
      let currentAddresses = this._memos.value;
      console.log('currentAddresses b4',currentAddresses);
      const index = currentAddresses.findIndex(x => x.m_id == id);
      const data = new Memo(
        
        param.title,
        param.date,
        param.content,
        param.feeling,
        id
      );
      currentAddresses[index] = data;
      console.log('currentAddresses',currentAddresses);
      this._memos.next(currentAddresses);
      // this._addressChange.next(data);
    } catch(e){
      throw(e);
    }
    // param.id =id;
  }


}
