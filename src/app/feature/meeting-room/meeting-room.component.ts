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

constructor( public formbuilder:FormBuilder,public route:Router,public loginservice:GoogleloginService ){

}
ngOnInit(){
this.form=this.formbuilder.group({
  Room:['',[Validators.required]],
  Timefrom:['',[Validators.required]],
  TimeTo:['',[Validators.required]],
  Date:['',[Validators.required]]

})
}

logout(){
  sessionStorage.removeItem('token')
this.route.navigateByUrl('login')

}
 Submit(){
  if (this.form.invalid){
    this.form.markAllAsTouched();
  }
  else {
this.loginservice.postdata(this.form.value).subscribe((data:any)=>{
  console.log(data)
})
this.form.reset()
}
 }


}
