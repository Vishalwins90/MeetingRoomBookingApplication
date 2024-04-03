import { DatePipe } from '@angular/common';
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
form:any
Roomdata:any
dataSource:any=[]
filterRoom:any
showtable:boolean=false
displayedColumns:any[]=['SmallRoomAvailable', 'LargeRoomAvailable','TotallargeRoom','TotalSmallRoom'];
constructor( public formbuilder:FormBuilder,public route:Router,public loginservice:GoogleloginService,private datePipe: DatePipe ){

}
ngOnInit(){
this.form=this.formbuilder.group({
  Room:['',[Validators.required]],
  Timefrom:['',[Validators.required]],
  TimeTo:['',[Validators.required]],
  Date:[new Date(),[Validators.required]]

})
debugger
this.loginservice.getroomdata().subscribe((data:any)=>{
  this.Roomdata=data
 

})

}

logout(){
  sessionStorage.removeItem('token')
this.route.navigateByUrl('login')

}
 Submit(){
  debugger
  console.log(this.filterRoom)
  if (this.form.invalid){
    this.form.markAllAsTouched();
  }
  else {
this.loginservice.postdata(this.form.value).subscribe((data:any)=>{
  console.log(data)
})
let time:any={
  Timefrom:this.form.value.Timefrom,
  TimeTo:this.form.value.TimeTo
}
debugger
let timefrom=(parseInt(time.Timefrom))
let TimeTo=(parseInt(time.TimeTo))

if (timefrom >12 || TimeTo <= 6 ) {
  this.Roomdata[0].LargeRoomAvailable = 5;  
  this.Roomdata[0].SmallRoomAvailable = 10;
this.loginservice.showSuccess(" Only 5 largeroom and only 10 smallroom is Avaibale this time ")

} else if (timefrom > 6 && TimeTo < 12) {
  this.Roomdata[0].LargeRoomAvailable = 10;
  this.Roomdata[0].SmallRoomAvailable = 5;
  this.loginservice.showSuccess(" Only 10 largeroom and only 5 smallroom is Avaibale this time ")
}
else {
  this.loginservice.Showerror(" no Room Avaiable on this time")
}



console.log(time)
this.form.reset()
this.showtable=true
}
 }
 getCurrentTime() {
  const currentDate = new Date();
  return this.datePipe.transform(currentDate, 'HH:mm')??'';
  

}
roomAvailable(){
  
}
}



