import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Branch } from '../../models/branch';
import { LoggerService } from '../../services/logger.service';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-new-branch',
  templateUrl: 'new-branch.component.html',
  styleUrls: ['new-branch.component.styl'],
})
export class NewBranchComponent {
  baseBranch: Branch;
  newBranchName: string

  constructor(
    private logger: LoggerService,
    private branchService: BranchService,
    private dialogRef: MatDialogRef<NewBranchComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { branch: Branch }
  ){
    this.baseBranch = data.branch;
  }

  /**
   * Create a branch.
   */
  createBranch(): void {
    const branchName = this.newBranchName;
    this.logger.info('Create branch', this.newBranchName);
    this.branchService.createBranch(branchName).subscribe(branch => {
      this.branchService.setCurrentBranch(branch);
      this.dialogRef.close();
    }, error => { });
  }
}
