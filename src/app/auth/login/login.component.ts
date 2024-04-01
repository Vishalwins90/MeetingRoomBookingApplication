import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleloginService } from 'src/app/core/Services/googlelogin.service';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {


  userdata: any

  constructor(public route: Router, private ngZone: NgZone, public logindata: GoogleloginService) { }

  ngAfterViewInit(): void {
    this.initializeGoogle();
  }

  initializeGoogle(): void {
    google.accounts.id.initialize({
      client_id: '471180406582-pqfv2d35gqq908rsqoppju7onoi0i6un.apps.googleusercontent.com',
      callback: (res: any) => {
        this.ngZone.run(() => {
          this.onGoogleSignIn(res);
          console.log(res)
        });
      }
    });

    google.accounts.id.renderButton(document.getElementById('google-login-button'), {});
  }

  onGoogleSignIn(response: any): void {
    if (response) {
      const payload = this.decodeToken(response.credential);
      this.logindata.googlogindata()
        .subscribe((data: any) => {
          this.userdata = data
          let matchdata = this.userdata.find((data: any) => data.Email === payload.email)
          if (matchdata) {
            this.ngZone.run(() => {
              sessionStorage.setItem('token', (matchdata.id))
              this.route.navigate(['dashboard']);
            });
          } else {
            this.logindata.showError(" user does not found")
          }
        });
    }
  }

   decodeToken(token: any): any {
    return JSON.parse(atob(token.split(".")[1]));
  }
}
