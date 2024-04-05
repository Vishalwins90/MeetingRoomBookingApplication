import { DatePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { from } from 'rxjs';
import { GoogleloginService } from 'src/app/core/Services/googlelogin.service';

@Component({
  selector: 'app-meeting-room',
  templateUrl: './meeting-room.component.html',
  styleUrls: ['./meeting-room.component.scss']
})
export class MeetingRoomComponent {
  form: any
  RoomData: any
  selectedLevel: any = []
  dataSource: any = []
  filterRoom: any
  showtable: boolean = false
  TotalRoom: any
  databyid: any
  showRooomdata: any
  ShowTotalRoom: boolean = false
  allloginuserdata: any;
  allTime: any = [];
  displayedColumns: any[] = ['SmallRoomAvailable', 'LargeRoomAvailable', 'TotallargeRoom', 'TotalSmallRoom'];
  constructor(public formbuilder: FormBuilder, public route: Router, public loginservice: GoogleloginService, private datePipe: DatePipe) {

  }
  ngOnInit() {
    debugger
    this.form = this.formbuilder.group({
      Room: ['', [Validators.required]],
      Timefrom: ['', [Validators.required]],
      TimeTo: ['', [Validators.required]],
      Date: [new Date(), [Validators.required]],
      SelectTotalRoom: ['', [Validators.required]]

    })

    this.loginservice.getroomdata().subscribe((data: any) => {
      this.RoomData = data
    })
  }

  logout() {
    sessionStorage.removeItem('token')
    this.route.navigateByUrl('login')

  }
// Show Meeting Room  Available According to user Select 
  Submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {

      this.loginservice.getbookingRoomdata().subscribe((data: any) => {
        this.allloginuserdata = data;
        this.allTime = {
          Timefrom: this.form.value.Timefrom,
          TimeTo: this.form.value.TimeTo
        }
        let bookingAccRoom = this.allloginuserdata.filter((booking: any) => (booking.Room == this.form.value.Room) && (booking.Timefrom == this.form.value.Timefrom) && (booking.TimeTo == this.form.value.TimeTo))
        if (bookingAccRoom.length && (bookingAccRoom[0].Timefrom == this.allTime.Timefrom) && (bookingAccRoom[0].TimeTo == this.allTime.TimeTo)) {
          this.loginservice.Showerror("Sorry no room Available for this time beacause all the are occupied")
        }
        else {
          if (this.form.value.Room === 'Large Room') {
            const totalLargeRoom = parseInt(this.RoomData[0].TotallargeRoom);
            const selectedRoom = parseInt(this.form.value.SelectTotalRoom);
            this.showRooomdata = totalLargeRoom - selectedRoom;
            this.RoomData[0].TotallargeRoom = this.showRooomdata;
            const data = {
              TotallargeRoom: this.RoomData[0].TotallargeRoom
            };
            this.loginservice.roomdataupdate(this.RoomData[0].id, data).subscribe((data: any) => {
              console.log(data);
            });
            this.showtable = true;
            this.form.reset();
           return  this.loginservice.showSuccess("Your Booking is done")
          }
      
          
          else if (this.form.value.Room === 'Small Room') {
            const totalSmallRoom = parseInt(this.RoomData[1].TotalSmallRoom);
            const selectedRoom = parseInt(this.form.value.SelectTotalRoom);
            this.showRooomdata = totalSmallRoom - selectedRoom;
            this.RoomData[1].TotalSmallRoom = this.showRooomdata;
            const data = {
              TotalSmallRoom: this.RoomData[1].TotalSmallRoom
            };
            this.loginservice.roomdataupdate(this.RoomData[1].id, data).subscribe((data: any) => {
              console.log(data);
            });
            this.showtable = true;
          }
          this.loginservice.postdata(this.form.value).subscribe((data: any) => {
            console.log(data);
         
          });

          this.ShowTotalRoom = false;
          this.form.reset();
      return  this.loginservice.showSuccess("Your Booking is done")
        }
     
      })

    }
  }

// get current time Automitcally select by using date
  getCurrentTime() {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'HH:mm') ?? '';
  }
// show large Room Aviabale and Smalll Room Aviabale according to dropdown select
  ShowRoomAccordingSelect(index: any) {
    console.log(this.form.value.Room)
    if (this.form.value.Room === 'Large Room') {
      this.TotalRoom = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    }
    else if (this.form.value.Room === 'Small Room') {
      this.TotalRoom = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
    this.ShowTotalRoom = true
  }
  getBookingFormClass() {
    return this.showtable ? 'col-md-4 col-md-pull-7' : 'col-md-4';
  }
  
  getBookingFormStyle() {
    return this.showtable ? 'position: absolute; margin-left: 63px; top: -124px;' : 'position: absolute; margin-left: 63px; top: -268px;';
  }
}



