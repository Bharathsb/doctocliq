import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, Popover, PopoverController, PopoverOptions, ViewController, ModalController } from 'ionic-angular';
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
  colors: any = ['#52A8EF', '#67D1DE', '#E0D45A', '#d69df2', '#86D6C2', '#F0C56E', '#857BCD', '#D79DBA', '#B1C84B', '#FEC2AA'];
  isListView: boolean;
  listViewDate: any;
  doctorName: string;
  selectedDoctorId: string;
  listAvaibleAppointments: any
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private alertCtrl: AlertController, public translateService: TranslateService
    , public api: Api, public shared: Shared,
    public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
    this.isListView = false;
    this.doctorName = undefined;
    this.listAvaibleAppointments = [];
    this.events = [];
  }



  handleEvent(event: CalendarEvent): void {
    let appointment = [];
    let modalAppointment;
    if (event.title !== 'Available') {
      appointment = this.listAppointments.appointment.filter((data) => (data.id === event['appointmentId']));
      // modalAppointment = this.modalCtrl.create(CreateAppointmentComponent, { appointmentDetails: appointment, doctorlist: this.doctors, type: "Update" });
      this.openAppointmentPage(appointment, "Update");
    } else {
      appointment = this.listAvaibleAppointments.filter((data) => (data.id === event['availableId']));
      // modalAppointment = this.modalCtrl.create(CreateAppointmentComponent, { appointmentDetails: appointment, doctorlist: this.doctors, type: "Save" });
      this.openAppointmentPage(appointment, "Save");
    }

    // modalAppointment.onDidDismiss(item => {
    //   this.getAppointments(this.startdayOfWeek, this.enddayOfWeek, false);
    // });
    // modalAppointment.present();
    //  if (appointment.length > 0) {
    //   this.navCtrl.push(CreateAppointmentComponent, { appointmentDetails: appointment, doctorlist: this.doctors, type: "Update" });
    // } else {
    //   appointment = this.listAvaibleAppointments.filter((data) => (data.id === event['availableId']));
    //   this.navCtrl.push(CreateAppointmentComponent, { appointmentDetails: appointment, doctorlist: this.doctors, type: "Save" });
    // }
    // this.viewCtrl.dismiss();
  }

  openAppointmentPage(appointment: any, title: string) {
    let modalAppointment;
    modalAppointment = this.modalCtrl.create(CreateAppointmentComponent, { appointmentDetails: appointment, doctorlist: this.doctors, type: title });
    modalAppointment.onDidDismiss(item => {
      if(item !== 'close'){
        this.getAppointments(this.startdayOfWeek, this.enddayOfWeek, false);
      }
    });
    modalAppointment.present();
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
      let tempListViewDate = new Date(this.listViewDate + ' ' + moment().format('YYYY'));
      let tmpdate = moment(tempListViewDate).add(1, 'days').toDate();
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
      let tempListViewDate = new Date(this.listViewDate + ' ' + moment().format('YYYY'));
      let tmpdate = moment(tempListViewDate).add(-1, 'days').toDate();
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
    this.checkTodayDate();
    this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
    this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
    this.enddayOfWeek = addDays(startOfWeek(new Date()), 6);
    this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
  }

  changeView(view: CalendarPeriod): void {
    this.view = view;
  }

  ngOnInit() {
    this.checkTodayDate();
    let tmpdate = moment(this.viewDate, "DD/MM/YYYY").toDate();
    if (moment(tmpdate).isoWeekday() === 7) {
      this.viewDate = moment(tmpdate).add(1, 'days').toDate();
    }

    this.getAppointments(this.startdayOfWeek, this.enddayOfWeek, false);
    this.api.get(this.api.apiDoctorList).map(res => res.json()).subscribe(res => {
      this.doctors = [];
      res.doctors.forEach((data, index) => {
        let color = (this.colors[index]) ? this.colors[index] : "#bbd0f5";
        let doctorObj = {
          id: data.id,
          name: data.title + data.first_name + " " + data.last_name,
          color: color,
          speciality: data.speciality
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
      if(item === "1"){
        this.openAppointmentPage(undefined, "Save");
      }
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
    this.listevents = [];
    this.events = [];
    this.listAppointments = [];
    this.shared.showLoading(this.translateService.instant('loading'));
    this.api.authpost(this.api.apiAppointments, body, false).map(res => res.json()).subscribe(res => {
      this.listAppointments = res;
      if (this.selectedDoctorId) {
        this.shared.hideLoading();
        this.selectedDoctor(this.selectedDoctorId);
      } else if (res && res.appointment) {
        if (!showListView) {
          this.loadEvents(res.appointment);
        } else {
          this.loadListEvents(res.appointment, fromDate);
        }
        this.shared.hideLoading();
      } else {
        this.shared.hideLoading();
        this.shared.ShowToast("No Appoinments");
      }
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
            primary: '#808080',
            secondary: this.getDoctorColor(data.doctor.id)
          }
        }
        newEvent['appointmentId'] = data.id;
        this.events.push(newEvent);
      });
    } catch (err) {
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

  private selectedDoctor(doctorId) {
    this.shared.showLoading(this.translateService.instant('loading'));
    let url = "clinics/get_workschedules/?doctor_id=" + doctorId + "&date=" + moment(this.startdayOfWeek).format('DD/MM/YYYY') + "&date_last=" + moment(this.enddayOfWeek).format('DD/MM/YYYY');
    this.api.get(url).map(res => res.json()).subscribe(res => {
      this.events = [];
      this.listAvaibleAppointments = [];
      if (this.listAppointments && this.listAppointments.appointment) {
        let filteredAppointments = [];
        filteredAppointments = this.listAppointments.appointment.filter((data) => (data.doctor.id === doctorId));
        this.loadEvents(filteredAppointments);
      }
      if (res.length > 0) {
        this.listAvaibleAppointments = res;
        res.forEach((data) => {
          let newEvent: CalendarEvent = {
            start: new Date(data.date + "T" + data.time_start),
            end: new Date(data.date + "T" + data.time_end),
            title: 'Available',
            cssClass: 'custom-event-none',
            color: {
              primary: '#808080',
              secondary: data.color
            }
          }
          newEvent['availableId'] = data.id;
          this.events.push(newEvent);
        });
      }
      this.shared.hideLoading();
    }, err => {
      this.shared.hideLoading();
      console.error('ERROR', err)
    });

  }

  private getDoctorColor(id) {

    if (this.doctors.find(data => (data.id === id))) {
      return this.doctors.find(data => (data.id === id)).color;
    }

    return "#bbd0f5";
  }


  private loadListData() {
    if (this.isListView) {
      let tmpdate = new Date();
      if (moment(tmpdate).isoWeekday() === 7) {
        tmpdate = moment(tmpdate).add(1, 'days').toDate();
      }
      this.listViewDate = moment(tmpdate).format('ddd MMM DD');
      this.getAppointments(tmpdate, undefined, true);
    } else {
      this.increment();
    }
  }

  private filterDoctors(mEvent) {
    let prevselectedDoctorid = this.selectedDoctorId;
    const myModalOptions: PopoverOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: "filter-width"
    };
    const myModal: Popover = this.popoverCtrl.create(PopOverPage, { doctorlist: this.doctors, type: 'filter', filteredId: this.selectedDoctorId }, );
    myModal.onWillDismiss(doctor => {
      if (doctor !== null && doctor.type === 'load') {
        this.doctorName = doctor.name;
        this.selectedDoctorId = doctor.id;
        if (prevselectedDoctorid !== doctor.id) {
          this.selectedDoctor(doctor.id);
        }
      } else if (doctor !== null && doctor.type === 'loadAll') {
        this.removeFilterDoctors(doctor);
        this.selectedDoctorId = undefined;
      }
    });
    myModal.present({
      ev: mEvent
    });
  }
  private removeFilterDoctors(mEvent) {
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

  private checkTodayDate() {
    let tmpdate = moment(this.viewDate, "DD/MM/YYYY").toDate();
    if (moment(tmpdate).isoWeekday() === 7) {
      this.viewDate = moment(tmpdate).add(1, 'days').toDate();
    }
  }
}

