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
  b_ranches: ReadonlyArray<Branch>;

  /**
   * An action is in progress.
   */
  isInAction: boolean;

  /**
   * Fetching remote.
   */
  isFetching: boolean;

  /**
   * Pusing to remote.
   */
  isPushing: boolean;

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

      const locals = branches.filter(v => v.type === 'local');
      const upsteams = new Set(locals.map(v => v.upstream));
      const remotes = branches.filter(
        v => v.type === 'remote' &&  // should be type: remote
          !v.name.endsWith('/HEAD') && // and not HEAD, which is a special one
          !upsteams.has(v.name));      // and not local upstream

      this.b_ranches = [...locals, ...remotes];
    });
  }

  /**
   * Switch branches.
   */
  checkout(branch: Branch): void {
    if (this.isInAction) {
      this.logger.warn('Checkout a branch is in progress.');
      return;
    }

    this.logger.info('Switch to branch', branch);
    this.isInAction = true;

    this.branchService.checkout(branch).subscribe(b => {
      this.branchService.setCurrentBranch(branch);
      this.getBranch();
      this.snackBar.open(`Switch to ${b.name}`, undefined, {
        duration: 800,
      });
      this.isInAction = false;
    }, error => {
      this.isInAction = false;
    });
  }

  /**
   * Fetch.
   */
  fetch(branch?: Branch): void {
    this.isInAction = true;
    this.isFetching = true;

    this.branchService.fetchBranch(branch).subscribe(b => {
      this.logger.info('Fetched:', b);
      this.isInAction = false;
      this.isFetching = false;
    }, err => {
      this.isInAction = false;
      this.isFetching = false;
    });
  }

  /**
   * Push a branch.
   */
  push(branch?: Branch): void {
    this.isInAction = true;
    this.isPushing = true;

    this.branchService.pushBranch(branch).subscribe(b => {
      this.logger.info('Pushed:', b);
      this.isInAction = false;
      this.isPushing = false;
    }, err => {
      this.isInAction = false;
      this.isPushing = false;
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
