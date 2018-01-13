import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { LoggerService } from '../services/logger.service';
import { RepositoryService } from '../services/repository.service';
import { RepositoryComponent } from '../subcomponents/repository.component';
import { BranchComponent } from '../subcomponents/branch.component';
import { Repository } from '../models/repository';

import { ErrorDialogComponent } from '../subcomponents/error-dialog.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.styl'],
})
export class NavComponent implements OnInit {
  repository: Repository;
  repositoryChangeSubscription: Subscription;

  constructor(
    private logger: LoggerService,
    private dialog: MatDialog,
    private repositoryService: RepositoryService
  ) {
    this.repositoryChangeSubscription = repositoryService.currentRepository$
      .subscribe(r => {
        this.logger.info('Nav component detects repository change:', r.name);
        this.repository = r;
      });
  }

  ngOnInit(): void {
    this.repositoryService.getLastOpenRepository().subscribe(r => {
      this.repository = r;
    });
  }

  showRepositories(): void {
    this.dialog.open(RepositoryComponent, {
      maxWidth: '90%',
      height: '100%',
    });
  }

  showBranches(): void {
    if (!this.repository) {
      return;
    }

    this.dialog.open(BranchComponent, {
      maxWidth: '90%',
      minWidth: '380px',
      height: '100%',
    });
  }
}
