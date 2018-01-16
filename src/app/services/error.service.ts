import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoggerService } from './logger.service';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

@Injectable()
export class ErrorService {
  constructor(
    private logger: LoggerService,
    private dialog: MatDialog
  ) { }

  showGitError(text: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { text }
    });
  }
}
