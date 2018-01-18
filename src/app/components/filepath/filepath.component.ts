import { Component, Input } from '@angular/core';
import { AppWorkingFileChange } from '../../models/workingfile';

@Component({
  selector: 'app-filepath',
  templateUrl: './filepath.component.html',
  styleUrls: ['./filepath.component.styl'],
})
export class FilepathComponent {
  @Input() file: AppWorkingFileChange;
}
