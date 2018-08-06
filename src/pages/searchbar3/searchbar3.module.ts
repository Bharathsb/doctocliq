import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Searchbar3Page } from './searchbar3';

@NgModule({
  declarations: [
    Searchbar3Page,
  ],
  imports: [
    IonicPageModule.forChild(Searchbar3Page),
  ],
  exports: [
    Searchbar3Page
  ]
})
export class Searchbar3PageModule {}
