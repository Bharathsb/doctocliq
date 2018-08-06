import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the Searchbar3Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-searchbar3',
  templateUrl: 'searchbar3.html',
})
export class Searchbar3Page {
  term: string = '';
  selectitem: any;
  patientList: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
    this.patientList = this.navParams.get("patientList")
    if (this.patientList === undefined) {
      this.patientList = [];
    }
  }

  searchFn(ev: any) {
    this.term = ev.target.value;
  }
  choose(item) {
    this.view.dismiss(item);
  }
  closeModal() {
    this.view.dismiss();
  }
}
