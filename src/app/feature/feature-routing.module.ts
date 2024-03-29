import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingRoomComponent } from './meeting-room/meeting-room.component';
import { AuthGuard } from '../core/guards/authguard.guard';
// import { AuthGuard } from '../core/guards/authguard.guard';

const routes: Routes = [
   {
     path:'',component:MeetingRoomComponent,
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
