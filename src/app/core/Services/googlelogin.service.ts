import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GoogleloginService {
public url='http://localhost:3000/loginuserdata'

constructor(public router:Router,public http:HttpClient,public toastr:ToastrService){

}

googlogindata(): any{
  return this.http.get(this.url)
}

showError(message:any){
  this.toastr.error(message)
}
postdata(data:any){
  return this.http.post(this.url,data)
}
}
