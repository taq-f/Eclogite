import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css']
})
export class CommitComponent {
  @Input() set hasStaged(v: boolean) {
    this._hasStaged = v;
    this.commitable = this._hasStaged && !!this.summary;
  }
  _hasStaged: boolean;
  commitable: boolean;

  summary: string;

  updateSummary(summary: string): void {
    this.summary = summary;
    this.commitable = this._hasStaged && !!this.summary;
  }
}
