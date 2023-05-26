import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Memo } from 'src/app/models/memo.model';

@Component({
  selector: 'app-dairy-card',
  templateUrl: './dairy-card.component.html',
  styleUrls: ['./dairy-card.component.scss'],
})
export class DairyCardComponent implements OnInit {

  @Input() memo:Memo;
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  // dateTime;
  

  constructor(private router: Router) { }

  ngOnInit() {
    // this.dateTime = new Date().toISOString()

    // setTimeout(() => {
    //   this.dateTime = new Date().toISOString();
    // });
  }

  deleting(){
    this.delete.emit(this.memo);
  }


  editing(){
    this.edit.emit(this.memo);
  }

 
  



}
