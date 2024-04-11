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
  bookingData: any
  databyid: any
  showRooomdata: any
  ShowTotalRoom: boolean = false
  allloginuserdata: any;
  allTime: any = [];
  bookingAccRoom: any
  displayedColumns: any[] = ['SmallRoomAvailable', 'LargeRoomAvailable', 'TotallargeRoom', 'TotalSmallRoom'];
  constructor(public formbuilder: FormBuilder, public route: Router, public loginservice: GoogleloginService, private datePipe: DatePipe) {

  }
  ngOnInit() {
    this.form = this.formbuilder.group({
      Room: ['', [Validators.required]],
      Timefrom: ['', [Validators.required]],
      TimeTo: ['', [Validators.required]],
      Date: [new Date(), [Validators.required]],
      SelectTotalRoom: ['', [Validators.required]]

    })

    this.deleteExpiredBookings()
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
      debugger
      const theBigDay = new Date();
      theBigDay.setHours(parseInt(this.form.value.Timefrom))
      console.log(theBigDay, "dd")
      this.loginservice.getbookingRoomdata().subscribe((data: any) => {
        this.allloginuserdata = data;
        this.allTime = {
          Timefrom: this.form.value.Timefrom,
          TimeTo: this.form.value.TimeTo
        }
        let bookingAccRoom = this.allloginuserdata.filter((booking: any) => (booking.Room == 'Large Room' || booking.Room == 'Small Room' == this.form.value.Room) && (booking.Timefrom == this.form.value.Timefrom) && (booking.TimeTo == this.form.value.TimeTo))
        if (bookingAccRoom.length && (bookingAccRoom[0].Timefrom == this.allTime.Timefrom) && (bookingAccRoom[0].TimeTo == this.allTime.TimeTo)) {
          this.loginservice.Showerror("Sorry no room Available for this time beacause all the are occupied")
        }
        else {
          if (this.form.value.Room === 'Large Room') {
            debugger
            if (this.form.value.SelectTotalRoom > this.RoomData[0].TotallargeRoom) {
              return this.loginservice.Showerror("Sorry All alllargeRoom is not Aviable this time please select less Room")
            }
            else {
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
              this.loginservice.postdata(this.form.value).subscribe((data: any) => {
                console.log(data);
              });
              this.ShowTotalRoom = false;
              this.showtable = true;
              this.form.reset();
              return this.loginservice.showSuccess("Your Booking is done")
            }

          }
          else if (this.form.value.Room === 'Small Room') {
            debugger
            if (this.form.value.SelectTotalRoom > this.RoomData[1].TotalSmallRoom) {
              return this.loginservice.Showerror("Sorry All SmallRoom is not Aviable this time please select less Room")
            }
            else {
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
            return this.loginservice.showSuccess("Your Booking is done")
          }
        }


      })

    }
  }

  getCurrentTime() {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'hh:mm a') ?? '';
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
  // get booking form class from html
  getBookingFormClass() {
    return this.showtable ? 'col-md-4 col-md-pull-7' : 'col-md-4';
  }
  // add css and remove css on condtion base on html of booking-form
  getBookingFormStyle() {
    return this.showtable ? 'position: absolute; margin-left: 63px; top: -124px;' : 'position: absolute; margin-left: 63px; top: -268px;';
  }


  deleteExpiredBookings() {
    const currentTime = new Date();
    this.loginservice.getbookingRoomdata().subscribe((data: any) => {
      this.bookingData = data;
      this.bookingData.forEach((booking: any,index:any) => {
        // const bookingTimeTo = new Date(booking.Date);
        const bookingTimeTo = new Date(booking.Date);
        // bookingTimeTo.setHours(parseInt(booking.TimeTo.split(":")[0]));
        bookingTimeTo.setHours(parseInt(booking.TimeTo.split(":")[0]));
        bookingTimeTo.setMinutes(parseInt(booking.TimeTo.split(":")[1]))
        if (currentTime >bookingTimeTo) {
          debugger
          this.loginservice.deleteBooking(booking.id).subscribe((data: any) => {
            if (data.Room == "Large Room") {
              debugger
              const totalLargeRoom = parseInt(this.RoomData[0].TotallargeRoom);
              let selectedRoom = parseInt(data.SelectTotalRoom)
              let addoldroom: any = selectedRoom + totalLargeRoom
              this.RoomData[0].TotallargeRoom = addoldroom
              const alldata: any = {
                TotallargeRoom: this.RoomData[0].TotallargeRoom
              }
              this.loginservice.roomdataupdate(this.RoomData[0].id, alldata).subscribe((data: any) => {
                console.log(data);
              });
            }
            else if (data.Room == "Small Room") {
              const TotalSmallRoom = parseInt(this.RoomData[1].TotalSmallRoom);
              let selectedRoom = parseInt(data.SelectTotalRoom)
              let addoldroom = selectedRoom + TotalSmallRoom
              this.RoomData[1].TotalSmallRoom = addoldroom
              const alldata: any = {
                TotalSmallRoom: this.RoomData[1].TotalSmallRoom
              }
              this.loginservice.roomdataupdate(this.RoomData[1].id, alldata).subscribe((data: any) => {
                console.log(data);
              });
            }
             this.bookingData.splice(index, 1);
          });
        }
      });
    });
  }

}
