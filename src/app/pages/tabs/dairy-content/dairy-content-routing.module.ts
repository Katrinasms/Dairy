import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DairyContentPage } from './dairy-content.page';

const routes: Routes = [
  {
    path: '',
    component: DairyContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DairyContentPageRoutingModule {}
