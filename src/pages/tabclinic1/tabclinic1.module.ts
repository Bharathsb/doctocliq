import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TabsclinicPage } from '../tabsclinic/tabsclinic';
import { Tabclinic1Page } from './tabclinic1';
// import { Tabclinic2Page } from '../tabclinic2/tabclinic2';
// import { Searchbar3Page } from '../searchbar3/searchbar3';
import { Tabclinic3Page } from '../tabclinic3/tabclinic3';
import { Http } from '@angular/http';
import { CalendarModule, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { CalendarWeekHoursViewModule } from 'angular-calendar-week-hours-view';
import { CustomEventTitleFormatterProvider } from '../../providers/custom-event-title-formatter/custom-event-title-formatter';
import { CustomDateFormatterProvider } from '../../providers/custom-date-formatter/custom-date-formatter';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopOverPage } from '../popoverMenuItem';
import { CreateAppointmentComponent } from '../createappointment';
import { CreatePatientComponent } from '../createpatient';
import { ModalPatientDetailPage } from '../modalPatientDetail';
import { CallNumber } from '@ionic-native/call-number';
import { HelpComponent } from '../help/help';


@NgModule({
  declarations: [
    TabsclinicPage,
    Tabclinic1Page,
    // Tabclinic2Page,
    Tabclinic3Page,
    PopOverPage,
    CreateAppointmentComponent,
    CreatePatientComponent,
    ModalPatientDetailPage,
    // Searchbar3Page
    HelpComponent
  ],
  imports: [
    BrowserModule,
    IonicPageModule.forChild(Tabclinic1Page),
    CalendarModule.forRoot(),
    CalendarWeekHoursViewModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    NgxPaginationModule
  ],
  entryComponents: [TabsclinicPage, Tabclinic1Page,
    // Tabclinic2Page,
    // Searchbar3Page,
    Tabclinic3Page,
    PopOverPage,
    CreateAppointmentComponent,
    CreatePatientComponent,
    ModalPatientDetailPage,
    HelpComponent
  ],
  exports: [

  ],
  providers: [
    CustomEventTitleFormatterProvider,
    CustomDateFormatterProvider,
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatterProvider
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatterProvider
    },
    CallNumber
  ]
})
export class Tabclinic1PageModule { }
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}