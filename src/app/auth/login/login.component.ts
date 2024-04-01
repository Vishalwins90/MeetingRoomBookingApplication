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
    this.initializeGoogle();
  }

  initializeGoogle(): void {
    google.accounts.id.initialize({
      client_id: '471180406582-pqfv2d35gqq908rsqoppju7onoi0i6un.apps.googleusercontent.com',
      callback: (res: any) => {
        this.onGoogleSignIn(res);
      }
    }); 

    google.accounts.id.renderButton(document.getElementById('google-login-button'), {
      type: 'standard',
      size: "medium"
    });
  }

  onGoogleSignIn(response: any): void {
    if (response) {
      const payload = this.decodeToken(response.credential);
      this.logindataservice.googlogindata()
        .subscribe((data: any) => {
          this.userdata = data;
          let matchdata = this.userdata.find((data: any) => data.Email === payload.email);
          if (matchdata) {     
            sessionStorage.setItem('token', (matchdata.id));
            this.route.navigate(['dashboard']);
            this.logindataservice.successMSG(" User login Successfull")
          } else {
            debugger
            this.logindataservice.errorMSG("user not found");
          }
        }, (error:any) => {
         
    
        });
    } 
  }

  decodeToken(token: any): any {
    return JSON.parse(atob(token.split(".")[1]));
  }
}