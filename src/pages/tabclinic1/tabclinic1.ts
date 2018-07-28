import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, Popover, PopoverController, PopoverOptions } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Shared } from '../../providers/shared';
import { Api } from '../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
import { PopOverPage } from '../../pages/popoverMenuItem';
import * as moment from 'moment';
import { CreateAppointmentComponent } from '../../pages/createappointment';
import { CreatePatientComponent } from '../../pages/createpatient';

import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subWeeks,
  addWeeks,
  subDays,
  addDays,
  endOfMonth,
  startOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  subMonths,
  addMonths,
} from 'date-fns';

import {
  CalendarEvent,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: addDays,
    week: addWeeks,
    month: addMonths
  }[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
  return {
    day: subDays,
    week: subWeeks,
    month: subMonths
  }[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: startOfDay,
    week: startOfWeek,
    month: startOfMonth
  }[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
  return {
    day: endOfDay,
    week: endOfWeek,
    month: endOfMonth
  }[period](date);
}

@IonicPage()
@Component({
  selector: 'page-tabclinic1',
  templateUrl: 'tabclinic1.html'
})

export class Tabclinic1Page implements OnInit {

  checked: boolean = true;
  switch_string: String = "AAA";
  startdayOfWeek: Date = addDays(startOfWeek(new Date()), 1);
  _startdayOfWeek: String = this.startdayOfWeek.toDateString().substring(4, 10);
  enddayOfWeek: Date = addDays(startOfWeek(new Date()), 6);
  _enddayOfWeek: String = this.enddayOfWeek.toDateString().substring(4, 10);
  viewDate: Date = new Date();
  view: CalendarPeriod = 'week';
  testEvent: any;
  locale: string = 'en';
  isDragging = false;
  refresh: Subject<any> = new Subject();
  minDate: Date = subMonths(new Date(), 1);
  maxDate: Date = addMonths(new Date(), 1);
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;
  excludeDays: number[] = [0];
  events: CalendarEvent[] = [];

  doctors: any;
  listAppointments: any;
  listevents: any;
  colors: any = [{ "id": 1, "color": "#52A8EF" },
  { "id": 9, "color": "#67D1DE" },
  { "id": 23, "color": "#E0D45A" },
  { "id": 33, "color": "#d69df2" },
  { "id": 49, "color": "#86D6C2" },
  { "id": 50, "color": "#F0C56E" },
  { "id": 51, "color": "#857BCD" },
  { "id": 6, "color": "#D79DBA" },];
  isListView: boolean;
  listViewDate: any;
  doctorName: string;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public translateService: TranslateService
    , public api: Api, public shared: Shared,
    public popoverCtrl: PopoverController) {
    this.isListView = false;
    this.doctorName = undefined;
  }



  handleEvent(event: CalendarEvent): void {

    if(event.title === 'Available'){
      this.navCtrl.push(CreatePatientComponent);
    }else{

    }
    // let alert = this.alertCtrl.create({
    //   title: event.title,
    //   message: event.start + ' to ' + event.end,
    //   buttons: ['OK']
    // });
    // alert.present();
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    if (this.isDragging) {
      return;
    }
    this.isDragging = true;

    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();

    setTimeout(() => {
      this.isDragging = false;
    }, 1000);
  }

  hourSegmentClicked(event): void {
    let newEvent: CalendarEvent = {
      start: event.date,
      end: addHours(event.date, 1),
      title: 'TEST EVENT',
      cssClass: 'custom-event',
      color: {
        primary: '#488aff',
        secondary: '#bbd0f5'
      },
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }

    this.events.push(newEvent);
    this.refresh.next();
  }

  increment(): void {
    if (!this.isListView) {
      this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
      this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
      this.enddayOfWeek = endOfWeek(this.viewDate);
      this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
      this.getAppointments(this.startdayOfWeek, this.enddayOfWeek, false);
    } else {
      let tmpdate = moment(this.listViewDate, "DD/MM/YYYY").add(1, 'days').toDate();
      if (moment(tmpdate).isoWeekday() === 7) {
        tmpdate = moment(tmpdate).add(1, 'days').toDate();
      } 
      this.listViewDate = moment(tmpdate).format('ddd MMM DD');
      this.getAppointments(tmpdate, undefined, true);
    }
  }

  decrement(): void {
    if (!this.isListView) {
      this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
      this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
      this.enddayOfWeek = endOfWeek(this.viewDate);
      this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
      this.getAppointments(this.startdayOfWeek, this.enddayOfWeek, false);
    } else {
      let tmpdate = moment(this.listViewDate, "DD/MM/YYYY").add(-1, 'days').toDate();
      if (moment(tmpdate).isoWeekday() === 7) {
        tmpdate = moment(tmpdate).add(-1, 'days').toDate();
      } 
      this.listViewDate = moment(tmpdate).format('ddd MMM DD');
      this.getAppointments(tmpdate, undefined, true);
    }
  }

  today(): void {
    this.changeDate(new Date());
    if (!this.isListView) {
      this.getAppointments(this.viewDate, undefined, false);
    } else {
      this.getAppointments(this.viewDate, undefined, true);
      this.listViewDate = moment(this.viewDate).format('ddd MMM DD');
    }
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
    this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
    this.enddayOfWeek = addDays(startOfWeek(new Date()), 6);
    this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
  }

  changeView(view: CalendarPeriod): void {
    this.view = view;
  }

  ngOnInit() {
    this.listViewDate = moment(this.viewDate).format('ddd MMM DD');
    this.getAppointments(this.startdayOfWeek, this.enddayOfWeek, false);
    this.api.get("clinics/get_doctors/").map(res => res.json()).subscribe(res => {
      this.doctors = [];
      res.doctors.forEach((data) => {
        let doctorObj = {
          id: data.id,
          name: data.title + data.first_name + " " + data.last_name,
          color: this.getColor(data.id)
        }
        this.doctors.push(doctorObj);
      });
    }, err => {
      console.error('ERROR', err)
      this.shared.ShowToast(err);
    });
  }

  private openMenu(myEvent) {
    const myModalOptions: PopoverOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true
    };
    let menuItem = [{ id: 1, name: "New appointment" }, { id: 2, name: "New patient" }];
    const myModal: Popover = this.popoverCtrl.create(PopOverPage, { item: menuItem, doctorlist: this.doctors, type: 'menu' }, );
    myModal.onDidDismiss(item => {

    });
    myModal.present({
      ev: myEvent
    });
  }

  private getAppointments(fromDate: any, toDate: any, showListView: boolean) {
    let body = { "param_date": moment(fromDate).format('DD/MM/YYYY') };
    if (toDate) {
      body['param_date_last'] = moment(toDate).format('DD/MM/YYYY')
    }
    // let seq = this.api.get("../assets/mock/appointments.json")
    this.listevents = [];
    this.events = [];
    this.shared.showLoading(this.translateService.instant('loading'));
    let seq = this.api.authpost("clinics/get_appointment/", body, false)
    seq.map(res => res.json()).subscribe(res => {
      this.listAppointments = res;
      if (!showListView) {
        this.loadEvents(res.appointment);
      } else {
        this.loadListEvents(res.appointment,fromDate);
      }
      this.shared.hideLoading();
    }, err => {
      console.error('ERROR', err)
      this.shared.hideLoading();
      this.shared.ShowToast(err);
    });
  }

  private loadEvents(appointments: any[]) {
    this.events = [];
    try {
      appointments.forEach((data) => {
        let newEvent: CalendarEvent = {
          start: new Date(data.start),
          end: new Date(data.end),
          title: data.patient.first_name,
          cssClass: 'custom-event',
          color: {
            primary: '#488aff',
            secondary: this.getColor(data.doctor.id)
          }
        }
        this.events.push(newEvent);
      });
    } catch (err) {
      this.shared.hideLoading();
      this.shared.ShowToast("No Appoinments");
    }
  }

  private loadListEvents(appointments: any[], listDate) {
    this.listevents = [];
    try {
      appointments.filter((appointmentData) => (moment(appointmentData.start).format('DD/MM/YYYY') === moment(listDate).format('DD/MM/YYYY'))).forEach((data) => {
        let newPatient = {
          time: moment(data.start).format('HH:mm A'),
          patientName: data.patient.first_name,
          reason: data.reason.title
        }
        this.listevents.push(newPatient);
      });
    } catch (err) {
      this.shared.hideLoading();
      this.shared.ShowToast(err);
    }

  }

  private selectedDoctor(doctor) {
    let filteredAppointments = [];
    this.shared.showLoading(this.translateService.instant('loading'));
    let url = "clinics/get_workschedules/?doctor_id=" + doctor.id + "&date=" + moment(this.startdayOfWeek).format('DD/MM/YYYY') + "&date_last=" + moment(this.enddayOfWeek).format('DD/MM/YYYY');
    this.api.get(url).map(res => res.json()).subscribe(res => {
      if (this.listAppointments && this.listAppointments.appointment) {
        filteredAppointments = this.listAppointments.appointment.filter((data) => (data.doctor.id === doctor.id));
        this.loadEvents(filteredAppointments);
      }
      if (res.length > 0) {
        res.forEach((data) => {
          let newEvent: CalendarEvent = {
            start: new Date(data.date + "T" + data.time_start),
            end: new Date(data.date + "T" + data.time_end),
            title: 'Available',
            cssClass: 'custom-event',
            color: {
              primary: '#488aff',
              secondary: data.color
            }
          }
          this.events.push(newEvent);
        });
      }
      this.shared.hideLoading();
    }, err => {
      this.shared.hideLoading();
      console.error('ERROR', err)
    });

  }

  private getColor(id) {

    if (this.colors.find(data => (data.id === id))) {
      return this.colors.find(data => (data.id === id)).color;
    }

    return "#bbd0f5";
  }


  private loadListData() {
    if (this.isListView) {
      this.getAppointments(this.viewDate, undefined, true);
    } else {
      this.increment();
    }
  }

  private filterDoctors() {
    const myModalOptions: PopoverOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true
    };
    const myModal: Popover = this.popoverCtrl.create(PopOverPage, { doctorlist: this.doctors, type: 'filter' }, );
    myModal.onWillDismiss(doctor => {
      if (doctor) {
        this.doctorName = doctor.name;
        this.selectedDoctor(doctor);
      }
    });
    myModal.present();
  }
  private removeFilterDoctors() {
    this.doctorName = undefined;
    if (this.listAppointments && this.listAppointments.appointment) {
      this.shared.showLoading(this.translateService.instant('loading'));
      this.loadEvents(this.listAppointments.appointment);
      this.shared.hideLoading();
    } else {
      this.events = [];
      this.shared.ShowToast("No Appoinments");
    }

  }
}

