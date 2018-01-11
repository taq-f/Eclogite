import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatMenuTrigger } from '@angular/material';
import { LoggerService } from '../services/logger.service';
import { BranchService } from '../services/branch.service';
import { RepositoryService } from '../services/repository.service';
import { Branch } from '../models/branch';
import { Repository } from '../models/repository';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.styl'],
})
export class BranchComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  branches: ReadonlyArray<Branch>;
  isCheckingOutBranch: boolean;

  constructor(
    private logger: LoggerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private branchService: BranchService,
    private repositoryService: RepositoryService
  ) { }

  ngOnInit(): void {
    this.getBranch();
  }

  getBranch(): void {
    this.branchService.branches().subscribe(branches => {
      this.logger.info('branches to be listed', branches);
      this.branches = branches;
    });
  }

  checkout(branch: Branch): void {
    if (this.isCheckingOutBranch) {
      this.logger.warn('Checkout a branch is in progress.');
      return;
    }

    this.logger.info('Switch to branch', branch);
    this.isCheckingOutBranch = true;

    this.branchService.checkout(branch.name).subscribe(() => {
      this.getBranch();
      this.snackBar.open(`Switch to ${branch.name}`, undefined, {
        duration: 700,
      });
      this.isCheckingOutBranch = false;
    });
  }
}
