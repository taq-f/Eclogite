import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { LoggerService } from '../services/logger.service';
import { RepositoryService } from '../services/repository.service';
import { BranchService } from '../services/branch.service';
import { StatusService } from '../services/status.service';
import { RepositoryComponent } from '../subcomponents/repository.component';
import { BranchComponent } from '../subcomponents/branch.component';
import { Repository } from '../models/repository';
import { Branch } from '../models/branch';

import { ErrorDialogComponent } from '../subcomponents/error-dialog.component';
import { Status } from '../models/status';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.styl'],
})
export class NavComponent implements OnInit {
  repository: Repository;
  branch: Branch;
  status: Status;

  repositoryChangeSubscription: Subscription;
  branchChangeSubscription: Subscription;
  statusChangeSubscription: Subscription;

  constructor(
    private logger: LoggerService,
    private dialog: MatDialog,
    private repositoryService: RepositoryService,
    private statusService: StatusService,
    private branchService: BranchService
  ) {
    this.repositoryChangeSubscription = repositoryService.currentRepository$
      .subscribe(r => {
        this.logger.info('Nav component detects repository change:', r.name);
        this.repository = r;
        // Repository change must cause current branch change.
        this.branchService.getCurrentBranch(r).subscribe(b => {
          this.branch = b;
        });
      });

    this.branchChangeSubscription = branchService.currentBranch$
      .subscribe(b => {
        this.logger.info('Nav component detects branch change:', b.name);
        this.branch = b;
      })
    
    this.statusChangeSubscription = statusService.statusChange$
      .subscribe(s => {
        this.logger.info('Nav component detects status change:', s);
        this.status = s;
      })
  }

  ngOnInit(): void {
    this.repositoryService.getLastOpenRepository().subscribe(r => {
      this.repository = r;
    });
    this.branchService.getCurrentBranch().subscribe(b => {
      this.branch = b;
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
