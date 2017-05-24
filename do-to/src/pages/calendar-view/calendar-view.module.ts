import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarView } from './calendar-view';

@NgModule({
  declarations: [
    CalendarView,
  ],
  imports: [
    IonicPageModule.forChild(CalendarView),
  ],
  exports: [
    CalendarView
  ]
})
export class CalendarViewModule {}
