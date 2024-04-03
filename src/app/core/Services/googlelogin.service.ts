import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
declare var gapi : any;
@Injectable({
  providedIn: 'root'
})
export class GoogleloginService {
public url='http://localhost:3000/loginuserdata'
public url2="http://localhost:3000/booking"
public url3="http://localhost:3000/rooms"
constructor(public router:Router,public http:HttpClient,public toastr:ToastrService, private snackBar:MatSnackBar){

}

googlogindata(): any{
  return this.http.get(this.url)
}

showSuccess(message:any){
  this.toastr.success(message)
}
postdata(data:any){
  return this.http.post(this.url2,data)
}
getroomdata(){
  return this.http.get(this.url3)
}
Showerror(message:any){
  this.toastr.error(message)
}



successMSG(msg:string) {
  this.snackBar.open(msg,'',{
    duration: 3000, panelClass: ['snackbar-success']
  });
}
errorMSG(msg:string, duration?:number) { 
  this.snackBar.open(msg,'',{
    duration: duration ? duration : 1000, panelClass: ['snackbar-error']
  });
}



}
