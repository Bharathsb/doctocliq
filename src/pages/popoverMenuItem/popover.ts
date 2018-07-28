import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Shared } from '../../providers/shared';
import { CreateAppointmentComponent } from '../../pages/createappointment';
import { CreatePatientComponent } from '../../pages/createpatient';

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
  constructor(private navParams: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
    this.menuItems = this.navParams.get('item');
    this.doctorsList = this.navParams.get('doctorlist');
    this.type = this.navParams.get('type');
  }

  close() {
    this.viewCtrl.dismiss();
  }
  
  open(id: any) {
    this.close();
    if( id === 1 ){
      this.navCtrl.push(CreateAppointmentComponent, { doctorlist: this.doctorsList });
    }else {
      this.navCtrl.push(CreatePatientComponent);
    }
  }

  private selectedDoctor(doctor) {
    this.viewCtrl.dismiss(doctor);
  }
}
