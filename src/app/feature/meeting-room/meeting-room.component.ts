import { DatePipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { elementAt } from 'rxjs';
import { GoogleloginService } from 'src/app/core/Services/googlelogin.service';

@Component({
  selector: 'app-meeting-room',
  templateUrl: './meeting-room.component.html',
  styleUrls: ['./meeting-room.component.scss']
})
export class MeetingRoomComponent {
  form: any
  RoomData: any
  getallid: any = []
  formattedDate: any
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
  firstimedata: any = []
  allTime: any = [];
  existingBooking: any = []
  alldatedata: any = []
  bookingAccRoom: any
  getddatafast: any
  firstSmallRoom: any = []
  displayedColumns: any[] = ['SmallRoomAvailable', 'LargeRoomAvailable', 'TotallargeRoom', 'TotalSmallRoom'];
  constructor(public formbuilder: FormBuilder, public route: Router, public loginservice: GoogleloginService, private datePipe: DatePipe) {

  }
  ngOnInit() {
    this.form = this.formbuilder.group({
      Room: ['', [Validators.required]],
      Timefrom: ['', [Validators.required]],
      TimeTo: ['', [Validators.required]],
      Date: [new Date(), [Validators.required]],
      AvailableRoom: ['', [Validators.required]]
    })

    // this.deleteExpiredBookings()
    this.loginservice.getroomdata().subscribe((data: any) => {
      this.RoomData = data
    })


    this.fetchBookingData();
    this.deleteExpiredBookings()

  }


  logout() {
    sessionStorage.removeItem('token')
    this.route.navigateByUrl('login')
  }

  Submit() {
    debugger
  if (this.form.invalid){
    this.form.markAllAsTouched();
  }
  else {
    const selectedDate = this.form.value.Date;
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    this.allTime = {
      Timefrom: this.form.value.Timefrom,
      TimeTo: this.form.value.TimeTo
    }
    let bookingAccRoom = this.bookingData.filter((booking: any) =>
      (booking.Room === this.form.value.room) &&
      (booking.Timefrom === this.form.value.Timefrom) &&
      (booking.TimeTo === this.form.value.TimeTo) &&
      (booking.Date === formattedDate)
    );
    if (bookingAccRoom.length > 0) {
      this.loginservice.Showerror("No Room Aviable this time beacuase Room are Allready Occupied")
    }

    else {
      if (this.form.value.Room === 'Large Room') {
        debugger
        const totalLargeRoom = this.RoomData.find((room: any) => room.size === 'Large Room').TotallargeRoom;
        const selectedRoom = parseInt(this.form.controls.AvailableRoom.value);
        let availableRooms = totalLargeRoom - selectedRoom;
        const payload: any = {
          Room: this.form.value.Room,
          Timefrom: this.form.value.Timefrom,
          TimeTo: this.form.value.TimeTo,
          Date: formattedDate,
          AvailableRoom: availableRooms,
          // bookedRoom: this.form.value.AvailableRoom
        };

        this.existingBooking = this.bookingData.find((booking: any) => booking.Date === formattedDate && booking.Room === 'Large Room');
        if (this.existingBooking) {
          if (this.existingBooking.AvailableRoom == 0) {
            // this.showtable = true;
            return this.loginservice.Showerror("No  largeRoom booking Aviabale for beacse all the room are booked")
          }
          else {
            const totalLargeRoom = (this.existingBooking.AvailableRoom)
            const selectedRoom = parseInt(this.form.controls.AvailableRoom.value);
            const availableRooms = totalLargeRoom - selectedRoom;
            this.existingBooking.AvailableRoom = availableRooms;
            const payload: any = {
              Room: this.form.value.Room,
              Timefrom: this.form.value.Timefrom,
              TimeTo: this.form.value.TimeTo,
              Date: formattedDate,
              bookedRoom: this.form.value.AvailableRoom,
              // AvailableRoom: availableRooms,
            };
            
            this.loginservice.postdata(payload).subscribe((data: any) => {
              console.log(data);
            });
            this.form.reset();
         
            this.showtable = true;
            // this.form.markAsPristine()

            return this.loginservice.showSuccess("Your large Booking done")
          }

        } else {
          debugger
          this.loginservice.postdata(payload).subscribe((data: any) => {
            this.firstimedata = data
            console.log(this.firstimedata);
          });

        }
        this.form.reset();
        this.showtable = true;
        // this.form.markAsPristine()
        this.ShowTotalRoom = false;
        this.showtable = true;
        ;
        return this.loginservice.showSuccess("Your large Booking done");
      }
      else if (this.form.value.Room === 'Small Room') {
        debugger
        const totalLargeRoom = this.RoomData.find((room: any) => room.size === 'Small Room').TotalSmallRoom;
        const selectedRoom = parseInt(this.form.controls.AvailableRoom.value);
        let availableRooms = totalLargeRoom - selectedRoom;
        const payload: any = {
          Room: this.form.value.Room,
          Timefrom: this.form.value.Timefrom,
          TimeTo: this.form.value.TimeTo,
          Date: formattedDate,
          AvailableRoom: availableRooms,
          // bookedRoom: this.form.value.AvailableRoom
        };
        const existingBooking = this.bookingData.find((booking: any) => booking.Date === formattedDate && booking.Room === 'Small Room');
        if (existingBooking) {
          if (existingBooking.AvailableRoom === 0) {
            debugger
            return this.loginservice.Showerror("No booking Aviabale for Today because all the room are booked")
          }
          else {
            const totalLargeRoom = (existingBooking.AvailableRoom)
            const selectedRoom = parseInt(this.form.controls.AvailableRoom.value);
            const availableRooms = totalLargeRoom - selectedRoom;
            existingBooking.AvailableRoom = availableRooms;
            const payload: any = {
              Room: this.form.value.Room,
              Timefrom: this.form.value.Timefrom,
              TimeTo: this.form.value.TimeTo,
              Date: formattedDate,
              // AvailableRoom: availableRooms,
              bookedRoom: this.form.value.AvailableRoom
            };

            let payload1: any = {
              AvailableRoom: existingBooking.AvailableRoom
            }

            this.loginservice.roomdataupdate(this.bookingData.id, payload1).subscribe((data: any) => {
              console.log(data);
            });
            this.loginservice.postdata(payload).subscribe((data: any) => {
              console.log(data);
            });

            this.form.reset();
 
            this.showtable = true;
            // this.form.markAsPristine()
            return this.loginservice.showSuccess("Your Small Booking done")
          }

        } else {
          debugger
          this.loginservice.postdata(payload).subscribe((data: any) => {
            this.firstSmallRoom = data
            console.log(this.firstimedata);
          });

        }
        this.form.reset();
        this.showtable = true;
        // this.form.markAsPristine()
        this.ShowTotalRoom = false;
        // this.showtable = true;

        return this.loginservice.showSuccess("Your Small Booking done");
      }

    }
    this.fetchBookingData();
  }
    


  }
  // it is for current time select first time
  getCurrentTime() {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'hh:mm a') ?? '';
  }
  // show large Room Aviabale and Smalll Room Aviabale according to dropdown select
  ShowRoomAccordingSelect(index: any) {
    debugger
    const selectedDate = this.form.value.Date;
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');

    // Filter bookingData for the selected date and room type
    const bookingsForSelectedDateAndRoom = this.bookingData.find((data: any) => (data.Date === formattedDate) && (data.Room === this.form.value.Room))
    this.alldatedata = bookingsForSelectedDateAndRoom
    if (bookingsForSelectedDateAndRoom) {
      this.alldatedata = bookingsForSelectedDateAndRoom;
      debugger
      if (this.form.value.Room === 'Large Room') {
        if (this.alldatedata.AvailableRoom === 0) {
          this.ShowTotalRoom = false;
          this.loginservice.Showerror("No large Room Available  because All the large Rooms are booked");
        } else {
          let alllargenumber = [];
          for (let i = 1; i <= this.alldatedata.AvailableRoom; i++) {
            alllargenumber.push(i);
          }
          this.TotalRoom = alllargenumber;
          this.ShowTotalRoom = true;
        }
      } else if (this.form.value.Room === 'Small Room') {
        if (this.alldatedata.AvailableRoom === 0) {
          this.ShowTotalRoom = false;
          this.loginservice.Showerror("No Small Room Available  because All the Small Rooms are booked");
        } else {
          let allSmallNumbers = [];
          for (let i = 1; i <= this.alldatedata.AvailableRoom; i++) {
            allSmallNumbers.push(i);
          }
          this.TotalRoom = allSmallNumbers;
          this.ShowTotalRoom = true;
        }
      }
    } else {
      // No bookings found for the selected date and room type
      if (this.form.value.Room === 'Large Room') {
        let alllargenumber = [];
        for (let i = 1; i <= this.RoomData[0].TotallargeRoom; i++) {
          alllargenumber.push(i);
        }
        this.TotalRoom = alllargenumber;
        this.ShowTotalRoom = true;
      } else if (this.form.value.Room === 'Small Room') {
        let allSmallNumbers = [];
        for (let i = 1; i <= this.RoomData[1].TotalSmallRoom; i++) {
          allSmallNumbers.push(i);
        }
        this.TotalRoom = allSmallNumbers;
        this.ShowTotalRoom = true;
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



  deleteExpiredBookings() {
    debugger
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    this.loginservice.getbookingRoomdata().subscribe((data: any) => {
      this.alldatedata = data;

      const now = new Date();
      const expiredBookings = this.alldatedata.filter((booking: any) => {
        const bookingDate = new Date(booking.Date);
        const bookingTime = this.convertTo24Hour(booking.TimeTo);

        // Combine booking date and time for comparison
        const bookingDateTime = new Date(`${booking.Date}T${bookingTime}`);

        return bookingDateTime <= now;
      });

      expiredBookings.forEach((booking: any) => {
        this.loginservice.deleteBooking(booking.id).subscribe((data: any) => {
          console.log(data);
        });
      });
    });
  }

  convertTo24Hour(timeString: string) {
    const [time, period] = timeString.split(' ');
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);


    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    }

    else if (period.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }


    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
    this.fetchBookingData()
  }
  fetchBookingData() {
    this.loginservice.getbookingRoomdata().subscribe((data: any) => {
      this.bookingData = data
    })
  }
}