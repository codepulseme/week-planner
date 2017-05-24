import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';
/**
 * Generated class for the Popover page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class Popover {

  public activeDay;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  pickDay(day) {
    this.activeDay = day;
    this.sendData();
  }
  sendData() {
    this.events.publish('pickedDay', this.activeDay);
    this.close();
  }

}
