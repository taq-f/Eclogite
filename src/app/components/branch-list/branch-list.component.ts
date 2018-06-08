import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Branch } from '../../models/branch';
import { MatTableDataSource } from '@angular/material';
import { checkout } from '../../lib/git/branch';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss'],
})
export class BranchListComponent {
  /**
   * Data source for MAT table.
   */
  branchSource: MatTableDataSource<Branch>;

  /**
   * List of branches to show.
   */
  @Input() set branches(branches: Array<Branch>) {
    this.branchSource = new MatTableDataSource<Branch>(branches);
  }

  /**
   * Events
   */
  @Output() checkout = new EventEmitter<Branch>();
  @Output() fetch = new EventEmitter<Branch>();
  @Output() push = new EventEmitter<Branch>();
  @Output() delete = new EventEmitter<Branch>();

  /**
   * Apply filter with givin text.
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.branchSource.filter = filterValue;
  }


}
