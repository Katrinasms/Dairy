import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { DairyCardComponent } from 'src/app/components/dairy-card/dairy-card.component';
// import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    // ExploreContainerComponentModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, DairyCardComponent]
})
export class HomePageModule {}
