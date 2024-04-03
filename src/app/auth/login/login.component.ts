import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleloginService } from 'src/app/core/Services/googlelogin.service';
// import { ToastrService } from 'src/app/core/Services/toast.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  userdata: any;
  constructor(public route: Router, public logindataservice: GoogleloginService) { }
  ngAfterViewInit(): void {
  debugger
    this.initializeGoogle();
  }
// It is use to for render google login
  initializeGoogle(): void {
    google.accounts.id.initialize({
      client_id: '471180406582-pqfv2d35gqq908rsqoppju7onoi0i6un.apps.googleusercontent.com',
      callback: (res: any) => {
      console.log(res)
        this.onGoogleSignIn(res);
      }
    }); 

    google.accounts.id.renderButton(document.getElementById('google-login-button'), {
      type: 'standard',
      size: "medium"
    });
  }
// It is use to match the data base from the database and navigate to login page
  onGoogleSignIn(response: any) {
    if (response) {
      debugger
      const payload = this.decodeToken(response.credential);
      this.logindataservice.googlogindata()
        .subscribe((data: any) => {
          this.userdata = data;
          let matchdata = this.userdata.find((data: any) => data.Email === payload.email);
          if (matchdata) {     
            sessionStorage.setItem('token', (matchdata.id));
            this.route.navigate(['dashboard']);
            this.logindataservice.successMSG("User login Successfull")
          } else {
            this.logindataservice.errorMSG("user not found");
          }
        }, (error:any) => {
        });
    } 
  }
// It is function is use to decode the user credential 
  decodeToken(token: any): any {
    debugger
    return JSON.parse(atob(token.split(".")[1]));
  }
}