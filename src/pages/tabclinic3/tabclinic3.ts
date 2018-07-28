import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Shared } from '../../providers/shared';
import { LandingPage } from '../../pages/landing/landing';

@Component({
  selector: 'page-tabclinic3',
  templateUrl: 'tabclinic3.html'
})
export class Tabclinic3Page {

  constructor(public navCtrl: NavController,public shared: Shared,) {

  }

  private logOut(){
    this.shared.clearStroage();
    this.navCtrl.push(LandingPage);
  }
}
