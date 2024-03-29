import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
// import { GoogleloginService } from 'src/app/core/Services/googlelogin.service';
import { GoogleloginService } from 'src/app/core/Services/googlelogin.service';
import { Router } from '@angular/router';

import { find } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  matchdata: any 
  user: any = []
  logindata: any
  constructor(private authService: SocialAuthService, public loginservice: GoogleloginService, public route: Router) {

  }
  public sub: any;

  ngOnInit() {
    this.sub = this.authService.authState.subscribe((user: SocialUser) => {
      this.user = user;
      console.log(user.email);
      this.loginservice.googlogindata().subscribe((data: any) => {
        this.logindata = data
     this.matchdata=this.logindata.find((data:any)=>
      data.Email===user.email
     )
     debugger
      if(this.matchdata){
        this.route.navigateByUrl('dashboard')
        sessionStorage.setItem('id', user.id)
      }
      else {
        this.loginservice.showError('user not Found')
      }
        });
      })
  

  }
  ngOnDestroy() {

      this.sub.unsubscribe();  
  
}

}
