import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing.module';
import { MeetingRoomComponent } from './meeting-room/meeting-room.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { UiModule } from '../ui/ui.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    MeetingRoomComponent
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    ReactiveFormsModule,
    UiModule,
    NgxMaterialTimepickerModule,
    DatePipe
    
    
  ]
})
export class FeatureModule { }
