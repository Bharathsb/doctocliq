import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController, ModalOptions, Popover, PopoverController, PopoverOptions } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Api } from '../../providers/api/api';
import { PopOverPage } from '../../pages/popoverMenuItem';
import * as moment from 'moment';


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
  doctors: any;

  locale: string = 'en';
  isDragging = false;
  refresh: Subject<any> = new Subject();
  minDate: Date = subMonths(new Date(), 1);
  maxDate: Date = addMonths(new Date(), 1);
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;
  excludeDays: number[] = [0];
  events: CalendarEvent[] = [];
  listAppointments: any;
  colors: any = [{ "id": 1, "color": "#52A8EF" },
  { "id": 6, "color": "#67D1DE" },
  { "id": 9, "color": "#E0D45A" },
  { "id": 23, "color": "#d69df2" },
  { "id": 33, "color": "#86D6C2" },
  { "id": 49, "color": "#F0C56E" },
  { "id": 50, "color": "#857BCD" },
  { "id": 51, "color": "#D79DBA" },]

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public api: Api,
    public popoverCtrl: PopoverController) {
  }



  handleEvent(event: CalendarEvent): void {
    let alert = this.alertCtrl.create({
      title: event.title,
      message: event.start + ' to ' + event.end,
      buttons: ['OK']
    });
    alert.present();
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
    this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
    this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
    this.enddayOfWeek = endOfWeek(this.viewDate);
    this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
    console.log(this.startdayOfWeek);
    // let tmp_date: Date = addPeriod(this.view, this.viewDate, 1); 
    // this.changeDate(tmp_date);
    // this.startdayOfWeek = startOfWeek(tmp_date);
    // this.enddayOfWeek = endOfWeek(tmp_date);
    // console.log(startOfWeek(this.startdayOfWeek));
    this.getAppointments(this.startdayOfWeek);
  }

  decrement(): void {
    this.startdayOfWeek = addDays(startOfWeek(this.viewDate), 1);
    this._startdayOfWeek = this.startdayOfWeek.toDateString().substring(4, 10);
    this.enddayOfWeek = endOfWeek(this.viewDate);
    this._enddayOfWeek = this.enddayOfWeek.toDateString().substring(4, 10);
    // let tmp_date: Date = subPeriod(this.view, this.viewDate, 1);
    // this.changeDate(tmp_date);
    // this.startdayOfWeek = startOfWeek(tmp_date);
    // this.enddayOfWeek = endOfWeek(tmp_date);
    this.getAppointments(this.startdayOfWeek);
  }

  today(): void {
    this.changeDate(new Date());
    this.getAppointments(this.viewDate);
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

    this.getAppointments(this.viewDate);

    this.api.get("clinics/get_doctors/").map(res => res.json()).subscribe(res => {
      console.log(res)
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
    });
  }

  private openMenu(myEvent) {
    const myModalOptions: PopoverOptions = {
      showBackdrop: true,
      enableBackdropDismiss: false
    };
    let menuItem = [{ id: 1, name: "New appointment" }, { id: 2, name: "New patient" }, { id: 3, name: "Legend" }];
    const myModal: Popover = this.popoverCtrl.create(PopOverPage, { item: menuItem, doctorlist: this.doctors }, );
    myModal.onDidDismiss(item => {

    });
    myModal.present({
      ev: myEvent
    });
  }

  private getAppointments(date: any) {
    //let body = { "param_date": "16/07/2018", "param_date_last": "20/07/2018", "csrfmiddlewaretoken": token };
    let body = { "param_date": moment(date).format('DD/MM/YYYY') };
    // let seq = this.api.get("../assets/mock/appointments.json")
    let seq = this.api.authpost("/api-v1/clinics/get_appointment/", body)
    seq.map(res => res.json()).subscribe(res => {
      console.log(res)
      this.listAppointments = res;
      this.loadEvents(res.appointment);
    }, err => {
      console.error('ERROR', err)
    });
  }

  private loadEvents(appointments: any) {
    this.events = [];
    appointments.forEach((data) => {
      let newEvent: CalendarEvent = {
        start: new Date(data.start),
        end: new Date(data.end),
        title: data.patient.first_name + data.patient.last_name,
        cssClass: 'custom-event',
        color: {
          primary: '#488aff',
          secondary: this.getColor(data.doctor.id)
        }
      }
      this.events.push(newEvent);
    });
  }
  private selectedDoctor(doctor) {
    let filteredAppointments = this.listAppointments.appointment.filter((data) => (data.doctor.id === doctor.id));
    this.loadEvents(filteredAppointments);
  }

  private getColor(id) {

    if (this.colors.find(data => (data.id === id))) {
      return this.colors.find(data => (data.id === id)).color;
    }

    return "#bbd0f5";
  }

}

