import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { RepositoryComponent } from './repository.component';
import { StatusComponent } from './status.component';
import { RepositoryService } from '../services/repository.service';
import { LoggerService } from '../services/logger.service';
import { AppWorkingFileChange } from '../models/workingfile';
import { Repository } from '../models/repository';

@Component({
  selector: 'app-workingfile',
  templateUrl: './workingfile.component.html',
  styleUrls: ['./workingfile.component.styl']
})
export class WorkingfileComponent implements OnDestroy, OnInit {
  @ViewChild(StatusComponent) statusComponent: StatusComponent;

  repositoryChangeSubscription: Subscription;

  /**
   * The currently opened repository.
   */
  repository: Repository;

  /**
   * The target file of diff.
   */
  workingfile: AppWorkingFileChange;

  hasStaged: boolean;

  constructor(
    private logger: LoggerService,
    private dialog: MatDialog,
    private repositoryService: RepositoryService
  ) {
    this.repositoryChangeSubscription = repositoryService.currentRepository$
      .subscribe(r => {
        this.logger.info('WorkingfileComponent detects repository change:', r.name);
        this.repository = r;
      });
  }

  ngOnInit(): void {
    this.repositoryService.getLastOpenRepository().subscribe(repository => {
      this.repository = repository;
    });
  }

  ngOnDestroy(): void {
    this.repositoryChangeSubscription.unsubscribe();
  }

  onEntrySelectChange(v: AppWorkingFileChange): void {
    this.workingfile = v;
  }

  onStatusRefreshed(p: {
    numOfUnstaged: number,
    numOfStaged: number,
    numOfConflicted: number,
  }): void {
    this.hasStaged = p.numOfStaged > 0;
  }

  refresh(): void {
    this.workingfile = undefined;
    this.statusComponent.getChanges();
  }

  openRepositoryDialog(): void {
    this.dialog.open(RepositoryComponent, {
      maxWidth: '90%',
      height: '100%',
    });
  }
}
