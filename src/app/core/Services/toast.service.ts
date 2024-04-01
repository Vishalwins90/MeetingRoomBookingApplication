import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class Toastr {
constructor(private snackBar:MatSnackBar) {}

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
