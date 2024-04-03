import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './core/guards/authguard.guard';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  
} from 'angularx-social-login';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr'
import { UiModule } from './ui/ui.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DatePipe } from '@angular/common';
// import { ToastService } from './core/Services/toast.service';
@NgModule({
  declarations: [
    AppComponent,
 
  ],
  imports: [
    NgxMaterialTimepickerModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    UiModule,
    

  ],
  providers: [
    DatePipe
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           '516638409563-de9eukafmmim57rh4vd7v0r47ues3en3.apps.googleusercontent.com'
    //         )
    //       },
       
    //     ],
       
    //   } as SocialAuthServiceConfig,
    // }
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
