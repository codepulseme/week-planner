import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';

import { TodolistService } from '../../providers/todolist-service';

//MOCK
//import { items } from '../../providers/todolist-mock';

/**
 * Generated class for the CalendarView page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-calendar-view',
  templateUrl: 'calendar-view.html',
  providers: [TodolistService]
})
export class CalendarView {

  public items;
  public activeDayFlag;
  private currentDate;
  public fullDate;

  constructor(public navCtrl: NavController, public navParams: NavParams, public todolistService: TodolistService, public storage: Storage) {
  }

  ionViewDidLoad() {
    // this.todolistService.getItemsPromise().then((val) => {
    //   this.todolistService.setItems(val);
    // });
    this.currentDate = new Date();
    this.activeDay(this.currentDate.getDay());
  }

  updateView() {
    this.todolistService.getListAPI(this.fullDate).subscribe(data => {
      this.items = data;
      this.todolistService.setItems(data);
    });
  }

  navigateOngoing() {
    this.navCtrl.setRoot(HomePage);
  }

  activeDay(day) {
    this.activeDayFlag = day;
    var currentDayFlag = this.currentDate.getDay();
    if (currentDayFlag === 0) currentDayFlag = 7;
    var difference = day - currentDayFlag;
    this.currentDate.setDate(this.currentDate.getDate() + difference);
    this.fullDate = this.currentDate.getDate() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getFullYear();
    this.updateView();
    //this.items = this.todolistService.getItemsDated(this.fullDate);


    // this.todolistService.getList(fullDate).subscribe(data => {
    //   var resItems = [];
    //   for (var i = 0; i < data.length; i++) {
    //     for (var id in data[i]){
    //       resItems.push({ id: data[i][id], text: data[i][id].text, done: data[i][id].done, date: data[i][id].date });
    //     }
    //
    //   }
    //   this.itemsDates = resItems;
    // });
    //this.items = items;
  }

  tickItem(item) {
    this.todolistService.updateItemAPI(item.id, !item.done, item.date).subscribe(data => this.updateView());
    // this.todolistService.tickItem(item.id);
    // this.items = this.todolistService.getItemsDated(this.fullDate);
  }
  deleteItem(item) {
    this.todolistService.deleteItemAPI(item.id, item.date).subscribe(data => {
      this.updateView();
    });
    // this.todolistService.deleteItem(item.id);
    // this.items = this.todolistService.getItemsDated(this.fullDate);
  }
  unscheduleItem(item) {
    var today = new Date()
    var todayDay = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.todolistService.updateItemAPI(item.id, item.done, todayDay).subscribe(data => this.updateView());
    // this.todolistService.unscheduleItem(item.id);
    // this.items = this.todolistService.getItemsDated(this.fullDate);
  }

}
