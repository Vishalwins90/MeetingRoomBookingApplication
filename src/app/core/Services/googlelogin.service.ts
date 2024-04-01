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

constructor(public router:Router,public http:HttpClient,public toastr:ToastrService, private snackBar:MatSnackBar){

}

googlogindata(): any{
  return this.http.get(this.url)
}

showError(message:any){
  this.toastr.clear(message)
}
postdata(data:any){
  return this.http.post(this.url,data)
}

successMSG(msg:string) {
  this.snackBar.open(msg,'',{
    duration: 3000, panelClass: ['snackbar-success']
  });
}
errorMSG(msg:string, duration?:number) { 
  this.snackBar.open(msg,'',{
    duration: duration ? duration : 3000, panelClass: ['snackbar-error']
  });
}

warningMSG(msg:string) {
  this.snackBar.open(msg,'',{
    duration: 3000, panelClass: ['snackbar-warning']
  });
}

}
