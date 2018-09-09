import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Shared } from '../../providers/shared';

@IonicPage()
@Component({
    selector: 'page-help',
    templateUrl: 'help.html',
})
export class HelpComponent {

    constructor(private view: ViewController, public navParams: NavParams,
        public translateService: TranslateService,public shared: Shared) {
    }

    closeModal() {
        this.view.dismiss();
    }

    ionViewDidEnter() {
        this.shared.setCurrentPage("HelpComponent");
    }
    ionViewWillLeave() {
        this.shared.setCurrentPage("tab3");
    }

    redirectTo(url: string) {
        window.open(url);
      }
}
