import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

@Injectable()
export class TodolistService {

  private url: string = 'https://infinite-taiga-98258.herokuapp.com/api/v1/todo/';

  public data;
  public items = [];

  constructor(public http: Http, public storage: Storage) {
  }
  catchError(error: Response | any) {
    console.log(error);
    return Observable.throw(error.json().error || 'Server Error');
  }
  getListAPI(date) {
    var url = this.url + date;
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(this.catchError);
  }

  updateItem(id, done) {
    let json = JSON.stringify({id: id, done: done, date: '20-5-2017'});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.url, json, options);
      // .catch(this.catchError);
  }
  addItemAPI(item) {
    let json = JSON.stringify({text: item});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.url, json, options)
      .catch(this.catchError);
  }

  addItem(item) {
    this.items.push(item);
    this.storage.set('items', this.items);
  }
  setItems(items) {
    this.items = items;
  }
  getItemsPromise() {
    return this.storage.get('items').then((val) => {
      return val;
    });
  }
  getItems() {
    return this.items;
  }
  getItemsDated(date) {
    var res = [];
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]['date']) {
        if (this.items[i]['date'] === date) {
          res.push(this.items[i]);
        }
      }
    }
    return res;
  }
  deleteItemAPI(id, date) {
    var url = this.url + date + '/' + id;
    return this.http.delete(url)
      .catch(this.catchError);
  }
  deleteItem(id): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]['id']) {
        if (this.items[i]['id'] === id) {
          this.items.splice(i, 1);
          break;
        }
      }
    }
    this.storage.set('items', this.items);
  }
  updateItemAPI(id, done, date) {
    let json = JSON.stringify({id: id, done: done, date: date});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.url, json, options)
      .catch(this.catchError);
  }
  tickItem(id): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]['id']) {
        if (this.items[i]['id'] === id) {
          this.items[i]['done'] = !this.items[i]['done'];
          break;
        }
      }
    }
    this.storage.set('items', this.items);
  }
  scheduleItem(id, date) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]['id']) {
        if (this.items[i]['id'] === id) {
          this.items[i]['date'] = date;
          break;
        }
      }
    }
    this.storage.set('items', this.items);
  }

  unscheduleItem(id) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i]['id']) {
        if (this.items[i]['id'] === id) {
          delete this.items[i]['date'];
          break;
        }
      }
    }
    this.storage.set('items', this.items);
  }

}
