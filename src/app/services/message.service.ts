import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}

  private _snackBar = inject(MatSnackBar);
  private snachbarRef: MatSnackBarRef<any> | undefined;

  showMessage(
    message: string,
    status: 'success' | 'error' | 'info' = 'success'
  ) {
    if (this.snachbarRef) {
      this.snachbarRef.dismiss();
    }

    let panelClass = '';
    switch (status) {
      case 'success':
        panelClass = 'success-snackbar';
        break;
      case 'error':
        panelClass = 'error-snackbar';
        break;
      case 'info':
        panelClass = 'info-snackbar';
        break;
      default:
        panelClass = '';
    }

    this.snachbarRef = this._snackBar.open(message, 'Close', {
      duration: 10000,
      panelClass: [panelClass],
      verticalPosition: 'top',
    });
  }
}
