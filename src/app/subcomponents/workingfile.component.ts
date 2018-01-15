import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class WorkingfileComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild(StatusComponent) statusComponent: StatusComponent;
  @ViewChild('leftPane') leftPane: ElementRef;
  leftPaneWidth = 250;

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

  ngAfterViewInit(): void {
    this.leftPane.nativeElement.style.flex = `0 0 ${this.leftPaneWidth}px`;
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

  resizeLeftPane(e: { x: number }) {
    this.leftPaneWidth = this.leftPaneWidth + e.x;
    this.leftPane.nativeElement.style.flex = `0 0 ${this.leftPaneWidth}px`;
  }
}
