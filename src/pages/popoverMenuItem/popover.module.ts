import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopOverPage } from './popover';

@NgModule({
  declarations: [
    PopOverPage,
  ],
  imports: [
    IonicPageModule.forChild(PopOverPage),
  ],
  exports: [
    PopOverPage
  ]
})
export class PopOverPageModule {}
