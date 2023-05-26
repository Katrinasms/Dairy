import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DairyContentPageRoutingModule } from './dairy-content-routing.module';

import { DairyContentPage } from './dairy-content.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DairyContentPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DairyContentPage]
})
export class DairyContentPageModule {}
