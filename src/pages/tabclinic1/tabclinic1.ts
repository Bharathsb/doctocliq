import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, Popover, PopoverController, ViewController, ModalController, PopoverOptions } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Shared } from '../../providers/shared';
import { Api } from '../../providers/api/api';
import { TranslateService } from '@ngx-translate/core';
import { PopOverPage } from '../../pages/popoverMenuItem';
import * as moment from 'moment';
import { CreateAppointmentComponent } from '../../pages/createappointment';
import { CreatePatientComponent } from '../../pages/createpatient';

import {
  startOfWeek,
  endOfWeek,
  addDays,
  subMonths,
  addMonths,
} from 'date-fns';

import {
  CalendarEvent,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { LandingPage } from '../landing/landing';

type CalendarPeriod = 'day' | 'week' | 'month';

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
  globalstartdayOfWeek: Date = addDays(startOfWeek(new Date()), 1);
  globalenddayOfWeek: Date = addDays(startOfWeek(new Date()), 6);
  viewDate: Date = new Date();
  view: CalendarPeriod = 'week';
  testEvent: any;
  locale: string;
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
  currentWeekAppointmentList: any;
  // colors: any = ['#52A8EF', '#67D1DE', '#E0D45A', '#d69df2', '#86D6C2', '#F0C56E', '#857BCD', '#D79DBA', '#B1C84B', '#FEC2AA'];
  colors: any = ['#5BCCC0', '#8cddf2', '#f2eba2', '#b4f7db', '#f2d7e3', '#edcb87', '#c0bcdd', '#D79DBA', '#B1C84B', '#FEC2AA'];
  isListView: boolean;
  listViewDate: any;
  selectedDoctorId: string;
  listAvaibleAppointments: any;
  handleBackButton: any;
  ViewTdyDate: string;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public translateService: TranslateService
    , public api: Api, public shared: Shared,
    public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
    this.isListView = false;
    this.listAvaibleAppointments = [];
    this.currentWeekAppointmentList = [];
    this.events = [];
    this.ViewTdyDate = undefined;
    if (this.translateService.currentLang === 'sp') {
      this.locale = 'es_ES'
      moment.locale(this.locale);
    } else {
      this.locale = 'en'
    }
  }

  handleEvent(event: CalendarEvent): void {
    let appointment = [];
    appointment = this.listAppointments.appointment.filter((data) => (data.id === event['appointmentId']));
    this.openAppointmentPage(appointment, "Update");
  }

  hourSegmentClicked(event): void {
    let appointment = [{ 'doctor': this.selectedDoctorId, 'date': new Date(event.date).toISOString(), 'time_start': moment(event.date).format("HH:mm:ss") }];
    this.openAppointmentPage(appointment, "Save");
  }

  openAppointmentPage(appointment: any, title: string): void {
    let modalAppointment;
    modalAppointment = this.modalCtrl.create(CreateAppointmentComponent, { appointmentDetails: appointment, doctorlist: this.doctors, type: title });
    modalAppointment.onDidDismiss(item => {
      if (item !== undefined && item !== 'close') {
        this.getAgenda(this.startdayOfWeek, this.enddayOfWeek, this.isListView);
      }
    });
    modalAppointment.present();
  }

  increment(): void {
    if (!this.isListView) {
      delete this.ViewTdyDate;
      this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
      this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
      this.enddayOfWeek = endOfWeek(this.viewDate);
      this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
      this.getAgenda(this.startdayOfWeek, this.enddayOfWeek, false);
    } else {
      let tempListViewDate = new Date(this.listViewDate + ' ' + moment().format('YYYY'));
      let tmpdate = moment(tempListViewDate).add(1, 'days').toDate();
      if (moment(tmpdate).isoWeekday() === 7) {
        tmpdate = moment(tmpdate).add(1, 'days').toDate();
      }
      this.listViewDate = moment(tmpdate).format('ddd MMM DD');
      // this.getAgenda(tmpdate, undefined, true);
      if (this.checkDateIsInThisWeek(tmpdate)) {
        let appointments = this.loadCurrentweekAppointments(tmpdate);
        this.loadListEvents(appointments, tmpdate);
      } else {
        this.getAgenda(tmpdate, undefined, true);
      }
    }
  }

  decrement(): void {
    if (!this.isListView) {
      delete this.ViewTdyDate;
      this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
      this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
      this.enddayOfWeek = endOfWeek(this.viewDate);
      this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
      this.getAgenda(this.startdayOfWeek, this.enddayOfWeek, false);
    } else {
      let tempListViewDate = new Date(this.listViewDate + ' ' + moment().format('YYYY'));
      let tmpdate = moment(tempListViewDate).add(-1, 'days').toDate();
      if (moment(tmpdate).isoWeekday() === 7) {
        tmpdate = moment(tmpdate).add(-1, 'days').toDate();
      }
      this.listViewDate = moment(tmpdate).format('ddd MMM DD');
      // this.getAgenda(tmpdate, undefined, true);
      if (this.checkDateIsInThisWeek(tmpdate)) {
        let appointments = this.loadCurrentweekAppointments(tmpdate);
        this.loadListEvents(appointments, tmpdate);
      } else {
        this.getAgenda(tmpdate, undefined, true);
      }
    }
  }

  today(): void {
    this.changeDate(new Date());
    if (!this.isListView) {
      this.getAgenda(this.viewDate, undefined, false);
      this.ViewTdyDate = moment(this.viewDate).format('ddd MMM DD');
    } else {
      this.getAgenda(this.viewDate, undefined, true);
      this.listViewDate = moment(this.viewDate).format('ddd MMM DD');
    }
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  changeView(view: CalendarPeriod): void {
    this.view = view;
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.checkTodayDate();
    this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
    this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
    this.enddayOfWeek = addDays(startOfWeek(new Date()), 6);
    this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
  }

  ngOnInit() {
    this.shared.loadClinicInfo();
    this.shared.showLoading(this.translateService.instant('loading'));
    this.checkTodayDate();
    let tmpdate = moment(this.viewDate, "DD/MM/YYYY").toDate();
    if (moment(tmpdate).isoWeekday() === 7) {
      this.viewDate = moment(tmpdate).add(1, 'days').toDate();
    }
    setTimeout(() => {
      this.shared.hideLoading();
      this.getAgenda(this.startdayOfWeek, this.enddayOfWeek, false);
    }, 0);
    this.api.get(this.api.apiDoctorList).map(res => res.json()).subscribe(res => {
      this.doctors = [];
      res.doctors.forEach((data, index) => {
        // let color = (this.colors[index]) ? this.colors[index] : "#bbd0f5";
        let color = this.colors[index %  this.colors.length];
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

  public openMenu(myEvent) {
    let menuItem = [{ id: 1, name: "New appointment" }, { id: 2, name: "New patient" }, { id: 3, name: "Filter Doctors" }, { id: 4, name: "Refresh" }];
    const myModal: Popover = this.popoverCtrl.create(PopOverPage, { item: menuItem, doctorlist: this.doctors, type: 'menu' });
    myModal.onDidDismiss(id => {
      if (id === "1") {
        this.openAppointmentPage(undefined, "Save");
      } else if (id === "2") {
        this.openPatientModal();
      } else if (id === "3") {
        this.filterDoctors();
      } else if (id === "4") {
        // Refresh
        if (!this.isListView) {
          this.getAgenda(this.startdayOfWeek, this.enddayOfWeek, this.isListView);
        } else {
          let tempListViewDate = new Date(this.listViewDate + ' ' + moment().format('YYYY'));
          this.getAgenda(tempListViewDate, undefined, this.isListView);
        }
      }
    });
    myModal.present({
      ev: myEvent
    });
  }

  private getAgenda(fromDate: any, toDate: any, showListView: boolean) {
    let body = { "param_date": moment(fromDate).format('DD/MM/YYYY') };
    if (toDate) {
      body['param_date_last'] = moment(toDate).format('DD/MM/YYYY')
    }
    this.listevents = [];
    this.events = [];
    this.listAppointments = [];
    this.shared.showLoading(this.translateService.instant('loading'));
    this.api.authpost(this.api.apiAppointments, body, false).map(res => res.json()).subscribe(res => {

      if (res && res.appointment) {
        this.listAppointments = res;
        if (moment(this.globalstartdayOfWeek).format('DD/MM/YYYY') === moment(fromDate).format('DD/MM/YYYY')) {
          this.currentWeekAppointmentList = [];
          this.currentWeekAppointmentList = res.appointment;
        }
        let appointments = [];
        if (this.selectedDoctorId) {
          appointments = res.appointment.filter((data) => (data.doctor.id === this.selectedDoctorId));
        } else {
          appointments = res.appointment;
        }
        if (!showListView) {
          this.loadEvents(appointments);
        } else {
          this.loadListEvents(appointments, fromDate);
        }
        this.shared.hideLoading();
      } else {
        this.listAppointments['appointment'] = [];
        this.shared.hideLoading();
        this.shared.ShowToast("No Appoinments");
      }

      /*this.listAppointments = res;
      if (this.selectedDoctorId) {
        this.shared.hideLoading();
        this.selectedDoctor(this.selectedDoctorId);
        if (showListView)
          this.loadListEvents(res.appointment, fromDate);
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
      } */
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
        if ((this.selectedDoctorId === undefined) || (this.selectedDoctorId === data.doctor.id)) {
          let newEvent: CalendarEvent = {
            start: new Date(data.start),
            end: new Date(data.end),
            title: (data.from_patient) ? (data.patient.first_name + '<span class="from_patient_calendar"></span>') : (data.patient.first_name),
            cssClass: 'custom-event',
            color: {
              primary: '#808080',
              secondary: this.getDoctorColor(data.doctor.id)
            }
          }
          newEvent['appointmentId'] = data.id;
          this.events.push(newEvent);
        }
      });
      if (this.events.length === 0) {
        this.shared.ShowToast("No Appoinment Data");
      }
    } catch (err) {
      this.shared.ShowToast("No Appoinment Data");
    }
  }

  private loadListEvents(appointments: any[], listDate) {
    this.listevents = [];
    try {
      let filteredAppointments = appointments.filter((appointmentData) => (moment(appointmentData.start).format('DD/MM/YYYY') === moment(listDate).format('DD/MM/YYYY')));
      filteredAppointments.forEach((data) => {
        if((this.selectedDoctorId === undefined) || (this.selectedDoctorId === data.doctor.id)){
          let listappointment = {
            time: moment(data.start).format('HH:mm A'),
            doctor: data.doctor.title + data.doctor.first_name + " " + data.doctor.last_name,
            patientName: data.patient.first_name + " " + data.patient.last_name,
            reason: data.reason.title,
            id: data.id
          }
          this.listevents.push(listappointment);
        }
      });
      if (this.listevents.length === 0) {
        this.shared.ShowToast("No Appoinment Data");
      }
    } catch (err) {
      this.shared.ShowToast(err);
    }
  }

  private getDoctorColor(id) {
    if (this.doctors.find(data => (data.id === id))) {
      return this.doctors.find(data => (data.id === id)).color;
    }
    return "#bbd0f5";
  }

  public loadListAppointmentsData() {
    this.shared.showLoading(this.translateService.instant('loading'));
    if (this.isListView) {
      let todayDate = new Date();
      todayDate = this.checkIfSundayExists(todayDate);
      this.listViewDate = moment(todayDate).format('ddd MMM DD');
      // this.getAgenda(todayDate, undefined, true);
      this.loadListEvents(this.loadCurrentweekAppointments(todayDate), todayDate);
    } else {
      // this.increment();
      delete this.ViewTdyDate;
      this.changeDate(new Date());
      this.listAppointments.appointment = Object.assign([], this.currentWeekAppointmentList);
      this.loadEvents(this.listAppointments.appointment);
    }
    this.shared.hideLoading();
  }

  public filterDoctors() {
    let prevselectedDoctorid = this.selectedDoctorId;
    const myModalOptions: PopoverOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: "filter-width"
    };
    const myModal: Popover = this.popoverCtrl.create(PopOverPage, { doctorlist: this.doctors, type: 'filter', filteredId: this.selectedDoctorId }, myModalOptions);
    myModal.onWillDismiss(doctor => {
      if (doctor !== null && doctor.type === 'load' && (prevselectedDoctorid !== doctor.id)) {
        this.selectedDoctorId = doctor.id;
        if (this.isListView) {
          this.loadOrRemoveFilterDoctorsinListAppointments();
        } else {
          this.shared.showLoading(this.translateService.instant('loading'));
          this.loadEvents(this.listAppointments.appointment);
          this.shared.hideLoading();
        }
      } else if (doctor !== null && doctor.type === 'loadAll') {
        this.selectedDoctorId = undefined;
        if (this.isListView) {
          this.loadOrRemoveFilterDoctorsinListAppointments();
        } else {
          this.removeFilterDoctors();
        }
      }
    });
    // myModal.present({
    //   ev: mEvent
    // });
    myModal.present();
  }

  /* private selectedDoctor(doctorId) {
    let filteredAppointments = [];
    filteredAppointments = this.listAppointments.appointment.filter((data) => (data.doctor.id === doctorId));
    this.shared.showLoading(this.translateService.instant('loading'));
    this.loadEvents(filteredAppointments);
    this.shared.hideLoading();
  } */

  private removeFilterDoctors() {
    this.shared.showLoading(this.translateService.instant('loading'));
    this.loadEvents(this.listAppointments.appointment);
    this.shared.hideLoading();
  }

  private loadOrRemoveFilterDoctorsinListAppointments() {
    this.shared.showLoading(this.translateService.instant('loading'));
    let tempListViewDate = new Date(this.listViewDate + ' ' + moment().format('YYYY'));
    if (this.checkDateIsInThisWeek(tempListViewDate)) {
      let appointments = this.loadCurrentweekAppointments(tempListViewDate);
      this.loadListEvents(appointments, tempListViewDate);
    } else {
      this.loadListEvents(this.listAppointments.appointment, tempListViewDate);
    }
    this.shared.hideLoading();
  }

  private checkTodayDate() {
    let tmpdate = moment(this.viewDate, "DD/MM/YYYY").toDate();
    if (moment(tmpdate).isoWeekday() === 7) {
      this.viewDate = moment(tmpdate).add(1, 'days').toDate();
    }
  }

  public loadAppointment(appointmentId) {
    let appointment = this.currentWeekAppointmentList.filter((data) => (data.id === appointmentId));
    if (appointment.length === 0)
      appointment = this.listAppointments.appointment.filter((data) => (data.id === appointmentId));
    this.openAppointmentPageFromList(appointment, "Update");
  }

  private openPatientModal() {
    let modalAppointment;
    modalAppointment = this.modalCtrl.create(CreatePatientComponent);
    modalAppointment.present();
  }

  openAppointmentPageFromList(appointment: any, title: string) {
    let modalAppointment;
    modalAppointment = this.modalCtrl.create(CreateAppointmentComponent, { appointmentDetails: appointment, doctorlist: this.doctors, type: title });
    modalAppointment.onDidDismiss(item => {
      if (item !== 'close') {
        let tempListViewDate = new Date(this.listViewDate + ' ' + moment().format('YYYY'));
        this.getAgenda(tempListViewDate, undefined, true);
      }
    });
    modalAppointment.present();
  }

  checkIfSundayExists(date: Date) {
    if (moment(date).isoWeekday() === 7) {
      return moment(date).add(1, 'days').toDate();
    }
    return date;
  }

  loadCurrentweekAppointments(inputDate: Date) {
    let appointments = [];
    try {
      appointments = this.currentWeekAppointmentList.filter((appointmentData) =>
        (moment(appointmentData.start).format('DD/MM/YYYY') === moment(inputDate).format('DD/MM/YYYY')));
    } catch (err) {
      this.shared.ShowToast(err);
    }
    return appointments;
  }

  checkDateIsInThisWeek(date: Date): boolean {
    return date >= this.globalstartdayOfWeek && date <= this.globalenddayOfWeek;
  }

  ionViewCanEnter() {
    let token = localStorage.getItem("key");
    if (token === undefined || token === null) {
      this.shared.clearStroage();
      this.navCtrl.setRoot(LandingPage);
    }
  }
  ionViewDidEnter() {
    this.shared.setCurrentPage("tab1");
  }

}

