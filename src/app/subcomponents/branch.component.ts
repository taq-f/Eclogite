import { Component, OnInit, ViewChild } from '@angular/core';
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

  newBranchName = '';

  constructor(
    private logger: LoggerService,
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

    this.branchService.checkout(branch).subscribe(b => {
      this.getBranch();
      this.snackBar.open(`Switch to ${b.name}`, undefined, {
        duration: 800,
      });
      this.isCheckingOutBranch = false;
    }, error => this.isCheckingOutBranch = false);
  }

  createBranch(): void {
    const branchName = this.newBranchName;
    this.logger.info('Create branch', this.newBranchName);

    this.branchService.createBranch(branchName).subscribe(branch => {
      this.snackBar.open(`Branch created: ${branch.name}`, undefined, {
        duration: 800,
      });
      this.newBranchName = '';
      this.getBranch();
    }, error => { });
  }
}
