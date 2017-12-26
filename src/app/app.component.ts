import { Component } from '@angular/core';
import { AppWorkingFileChange } from './models/workingfile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  repositoryPath = '';
  filepath: string;

  onEntrySelectChange(v: AppWorkingFileChange): void {
    this.filepath = v.path;
  }
}
