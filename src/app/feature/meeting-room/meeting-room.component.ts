import { DatePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
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
    const selectedDate = this.form.value.Date;
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
     let  alldata:any={
      Room: this.form.value.Room,
      Timefrom: this.form.value.Timefrom,
      TimeTo: this.form.value.TimeTo,
      Date: formattedDate,
      SelectTotalRoom: this.form.value.selectedRoom
     }
     this.loginservice.postdata(alldata).subscribe((data:any)=>{
      console.log(alldata)
     })
     this.form.reset()
  
  }
  // it is for current time select first time
  getCurrentTime() {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'hh:mm a') ?? '';
  }
  // show large Room Aviabale and Smalll Room Aviabale according to dropdown select
  ShowRoomAccordingSelect(index: any) {

    
    // it is for today booking date 
      if (this.form.value.Room === 'Large Room') {
        if ((this.RoomData[0].TotallargeRoom === 0)) {
          this.ShowTotalRoom = false
          this.loginservice.Showerror("No largeroom Room Aviabale for Today Beacsue All the largeRoom Book")
        }
        else {
          let numbers: any = []
          numbers.push(this.RoomData[0].TotallargeRoom)
          let alllargenumber: any = []
          for (let i = 1; i <= numbers[0]; i++) {
            alllargenumber.push(i)
            this.TotalRoom = alllargenumber
          }
          this.ShowTotalRoom = true
        }
      }

      else if (this.form.value.Room === 'Small Room') {
        
        if ((this.RoomData[1].TotalSmallRoom == 0)) {
          this.showtable = false
          this.loginservice.Showerror("No Small Room Aviabale for Today Beacsue All the Small Book")
        }
        else {
          let numbers: any = []
          numbers.push(this.RoomData[1].TotalSmallRoom)
          let alllargenumber: any = []
          for (let i = 1; i <= numbers[0]; i++) {
            alllargenumber.push(i)
            this.TotalRoom = alllargenumber
          }
          this.ShowTotalRoom = true
        }
      
    }

  }
  // get booking form class from html
  getBookingFormClass() {
    return this.showtable ? 'col-md-4 col-md-pull-7' : 'col-md-4';
  }
  // add css and remove css on condtion base on html of booking-form
  getBookingFormStyle() {
    return this.showtable ? 'position: absolute; margin-left: 63px; top: -124px;' : 'position: absolute; margin-left: 63px; top: -268px;';
  }


  // this is the funtion to join the date and time 
  parseDaytime(time: any) {

    let [hours, minutes] = time.substr(0, time.length - 2).split(":").map(Number);
    if (time.includes("pm") && hours !== 12) {
      hours += 12;
    }
    return 1000 * 60 * (hours * 60 + minutes);
  }

  convertTo24Hour(timeString: any) {
    let currentdate = new Date()
    let Todaydate = currentdate.getDate()
    let month = currentdate.getMonth() + 1
    let year = currentdate.getFullYear()
    let fulldate = `${Todaydate}/${month}/${year}`
    let date = new Date(`${fulldate} ${timeString}`);
    let formattedTime = date.toLocaleTimeString('en-GB',
      { hour12: false });
    return formattedTime;
  }
  deleteExpiredBookings() {
    this.loginservice.getbookingRoomdata().subscribe((data: any) => {
      let booking = data[data.length - 1]
      const time = this.convertTo24Hour(booking.TimeTo);
      const start = new Date();
      const end = new Date((new Date(booking.Date).getHours() + this.parseDaytime(time)))
      let Totaltime = (end.getTime() - start.getTime()) / 1000;
      let timeout = Math.round(Totaltime)
      console.log(start.getTime())
      console.log(end.getTime())
      console.log(timeout)
      setTimeout(() => {
        console.log('resultInMinutes', timeout)
        this.loginservice.deleteBooking(booking.id).subscribe((data: any) => {
          if (data.Room == "Large Room") {
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
        });
      }, timeout * 1000);
    });
  }
  onDateChange(event: MatDatepickerInputEvent<any, unknown>) {
    const tomorrowDate = new Date();
    const currentDate = new Date();
    tomorrowDate.setDate(currentDate.getDate() + 1);
    const selectedDate = this.form.value.Date;
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
   
}

}

