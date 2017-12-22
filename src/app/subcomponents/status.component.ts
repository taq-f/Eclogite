import { Component, OnInit } from '@angular/core';

import { WorkingFileChange } from '../models/workingfile';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  changes: WorkingFileChange[];

  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
    this.statusService.getStatus().subscribe(fileChanges => {
      this.changes = fileChanges;
    });
  }

}
