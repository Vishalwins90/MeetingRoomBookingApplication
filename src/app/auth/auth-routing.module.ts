import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../core/guards/authguard.guard';
import { UnauthGuard } from '../core/guards/unauth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent ,canActivate:[UnauthGuard] },
]



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }