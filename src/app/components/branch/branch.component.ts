import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatMenuTrigger } from '@angular/material';
import { LoggerService } from '../../services/logger.service';
import { BranchService } from '../../services/branch.service';
import { Branch } from '../../models/branch';
import { Repository } from '../../models/repository';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.styl'],
})
export class BranchComponent implements OnInit {
  /**
   * List of existing branches.
   */
  branches: ReadonlyArray<Branch>;

  /**
   * Checking out a branch is in progress.
   */
  isCheckingOutBranch: boolean;

  /**
   * A new branch name that the user specifies.
   */
  newBranchName = '';

  constructor(
    private logger: LoggerService,
    private snackBar: MatSnackBar,
    private branchService: BranchService
  ) { }

  ngOnInit(): void {
    this.getBranch();
  }

  /**
   * Get and load existing branches.
   */
  getBranch(): void {
    this.branchService.getBranches().subscribe(branches => {
      this.logger.info('branches to be listed', branches);
      this.branches = branches;
    });
  }

  /**
   * Switch branches.
   */
  checkout(branch: Branch): void {
    if (this.isCheckingOutBranch) {
      this.logger.warn('Checkout a branch is in progress.');
      return;
    }

    this.logger.info('Switch to branch', branch);
    this.isCheckingOutBranch = true;

    this.branchService.checkout(branch).subscribe(b => {
      this.branchService.setCurrentBranch(branch);
      this.getBranch();
      this.snackBar.open(`Switch to ${b.name}`, undefined, {
        duration: 800,
      });
      this.isCheckingOutBranch = false;
    }, error => {
      this.isCheckingOutBranch = false;
    });
  }

  /**
   * Create a branch.
   */
  createBranch(): void {
    const branchName = this.newBranchName;
    this.logger.info('Create branch', this.newBranchName);

    this.branchService.createBranch(branchName).subscribe(branch => {
      this.branchService.setCurrentBranch(branch);
      this.snackBar.open(`Branch created: ${branch.name}`, undefined, {
        duration: 800,
      });
      this.newBranchName = '';
      this.getBranch();
    }, error => { });
  }
}
