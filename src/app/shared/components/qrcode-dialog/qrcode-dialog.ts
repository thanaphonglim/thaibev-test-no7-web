import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { QRCodeComponent } from 'angularx-qrcode';
@Component({
  selector: 'app-qrcode-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, QRCodeComponent],
  templateUrl: './qrcode-dialog.html',
  styleUrl: './qrcode-dialog.scss',
})
export class QrcodeDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
