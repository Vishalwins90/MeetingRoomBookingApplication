import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './core/guards/authguard.guard';
import { UnauthGuard } from './core/guards/unauth.guard';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
   {
     path: 'dashboard',
     loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule),
     canActivate:[AuthGuard]

  

  },
  { path: 'login', component: LoginComponent,canActivate:[UnauthGuard] }, 
 { path: '', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
