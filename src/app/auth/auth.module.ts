import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from '../app-routing.module';
import { SocialLoginModule } from 'angularx-social-login';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UiModule } from '../ui/ui.module';
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AppRoutingModule,
    SocialLoginModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }), 
    UiModule
  ],
  providers: [
    ToastrService
  ]
})
export class AuthModule { }
