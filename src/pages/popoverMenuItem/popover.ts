import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController } from 'ionic-angular';
/**
 * Generated class for the ModalfiltersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popoverPage.html',
})
export class PopOverPage {
  menuItems;
  doctorsList: any;
  type: string;
  filteredId: string;
  constructor(private navParams: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
    this.menuItems = this.navParams.get('item');
    this.doctorsList = this.navParams.get('doctorlist');
    this.type = this.navParams.get('type');
    this.filteredId = this.navParams.get('filteredId');
  }

  close() {
    this.viewCtrl.dismiss();
  }
  
  open(id: any) {
    this.viewCtrl.dismiss(id.toString());
  }

  selectedDoctor(doctor,type) {
    if(type === 'load'){
      doctor['type'] = type;
    } else if(type === 'loadAll') {
      let tempdoctor ={'type': type};
      doctor = tempdoctor;
    }
    this.viewCtrl.dismiss(doctor);
  }
}
