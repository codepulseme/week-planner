import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { TodolistService } from '../../providers/todolist-service';

import { CalendarView } from '../calendar-view/calendar-view';
import { Popover } from '../popover/popover';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Keyboard, TodolistService]
})

export class HomePage {

  public items;
  public hideInput = true;
  public week = 0;
  public lastId = 0;

  @ViewChild('input') inputText: ElementRef;
  @ViewChild('alllist') allList;

  constructor(public popoverCtrl: PopoverController, public navCtrl: NavController, private keyboard: Keyboard, public renderer: Renderer, public elementRef: ElementRef, public navParams: NavParams, public todolistService: TodolistService, public storage: Storage, public events: Events) {
    events.subscribe('pickedDay', (day) => {
      this.storage.get('activeItem').then((item) => {
        this.storage.get('activeWeek').then((week) => {
          this.scheduleItem(item, day, week);
        });
      });
    });
  }

  ionViewDidLoad(){
    // this.storage.get('lastId').then((val) => {
    //   this.lastId = val;
    // });
    // this.todolistService.getItemsPromise().then((val) => {
    //   this.items = val;
    //   this.todolistService.setItems(val);
    // });

    this.todolistService.getListAPI('').subscribe(data => {
      this.items = data;
      this.todolistService.setItems(data);
    });
  }

  addItem(el) {
    this.lastId++;
    this.storage.set('lastId', this.lastId);
    //this.todolistService.addItem({text: el.value, done: false, id: this.lastId});
    this.todolistService.addItemAPI(el.value).subscribe(data => {
      this.ionViewDidLoad();
    });
    //this.items = this.todolistService.getItems();
    el.value = null;
  }
  tickItem(item) {
    this.todolistService.updateItemAPI(item.id, !item.done, item.date).subscribe(data => this.ionViewDidLoad());
    // this.todolistService.tickItem(item.id);
    // this.items = this.todolistService.getItems();
  }
  scheduleItem(item, day, week) {
    if (day === 0) day = 7;
    var currentDate = new Date();
    var currentDayWeek = currentDate.getDay();
    if (currentDayWeek === 0) currentDayWeek = 7;
    var difference = day - currentDayWeek;
    currentDate.setDate(currentDate.getDate() + difference + week * 7);
    var fullDate = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear();
    this.todolistService.updateItemAPI(item.id, item.done, fullDate).subscribe(data => this.ionViewDidLoad());
    //this.todolistService.scheduleItem(item.id, fullDate);
    //this.items = this.todolistService.getItems();
  }
  deleteItem(item) {
    this.todolistService.deleteItemAPI(item.id, item.date).subscribe(data => {
      this.ionViewDidLoad();
    });
    //this.todolistService.deleteItem(item.id);
    //this.items = this.todolistService.getItems();
  }
  navigateCalendar() {
    this.navCtrl.setRoot(CalendarView);
  }

  presentPopover(myEvent, week, item, index) {
    this.storage.set('activeWeek', week);
    this.storage.set('activeItem', item);
    let popover = this.popoverCtrl.create(Popover);
    popover.present({
      ev: myEvent
    });
  }

  addAction(event) {
    var that = this;
    this.hideInput = false;
    setTimeout(function(){
      that.renderer.invokeElementMethod(
        that.elementRef.nativeElement.querySelector('input'), 'focus', []
      );
    }, 400);
  }

  unFocusInput() {
    this.hideInput = true;
  }
}
