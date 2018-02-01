import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import { MatSnackBar, MatMenuTrigger } from '@angular/material';
import { LoggerService } from '../../services/logger.service';
import { BranchService } from '../../services/branch.service';
import { Branch } from '../../models/branch';
import { Repository } from '../../models/repository';
import { NewBranchComponent } from '../new-branch/new-branch.component';

// TODO make it service.
import { remote } from 'electron';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit {
  /**
   * List of existing branches.
   */
  branches: MatTableDataSource<Branch>;

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
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private branchService: BranchService
  ) { }

  ngOnInit(): void {
    this.getBranch();
  }

  /**
   * Open a dialog to create a new branch.
   */
  openNewBranchDialog(): void {
    this.branchService.getCurrentBranch().subscribe(b => {
      this.dialog.open(
        NewBranchComponent,
        {
          width: '350px',
          data: {
            branch: b
          }
        }
      ).afterClosed().subscribe(cancel => {
        if (cancel) {
          return;
        }
        this.getBranch();
      });
    });
  }

  /**
   * Get and load existing branches.
   */
  getBranch(): void {
    this.branchService.getBranches().subscribe(branches => {
      this.logger.info('branches to be listed', branches);
      const list = branches.filter(b => b.type === 'local');
      this.branches = new MatTableDataSource<Branch>(list);
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
   * Delete a branch.
   */
  delete(branch: Branch): void {
    this.branchService.deleteBranch(branch).subscribe(b => {
      this.logger.info('Branch deleted:', branch);
      this.getBranch();
      this.snackBar.open(`Deleted: ${b.name}`, undefined, {
        duration: 800,
      });
    });
  }
}
