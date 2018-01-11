import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
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
    const id = this.route.snapshot.paramMap.get('repositoryId');
    if (id) {
      this.repositoryService.saveLastOpenRepository(id).subscribe(() => {
        this.repositoryService.getRepository(id).subscribe(repository => {
          this.getBranch();
        });
      });
    } else {
      this.repositoryService.getLastOpenRepository(true).subscribe(repository => {
        if (!repository) {
          this.router.navigate(['/repository']);
        }
        this.getBranch();
      });
    }
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

@Component({
  selector: 'app-snack-bar-checkout-complete',
  template: `aaa`,
  styles: [
    `.example-pizza-party { color: hotpink; }`
  ],
})
export class CheckoutCompleteComponent { }
