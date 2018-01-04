import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { CommitService } from '../services/commit.service';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.css'],
  animations: [
    trigger('size', [
      state('expand', style({ height: '*' })),
      state('shrink', style({ height: '30px' })),
      transition('expand <=> shrink', animate('200ms ease')),
    ]),
  ],
})
export class CommitComponent implements OnInit {
  @Input() repositoryPath: string;
  /**
   * Whether one or more files has been staged. This component need to know it
   * in order to judge the user can commit or not.
   */
  @Input() set hasStaged(v: boolean) {
    this._hasStaged = v;
    this.commitable = this.isCommitable();
  }
  _hasStaged: boolean;

  @Output() commitDone = new EventEmitter<undefined>();

  /**
   * Commit can be taken now?
   */
  commitable: boolean;

  /**
   * Summary of the commit.
   */
  summary = '';

  /**
   * Description of the commit.
   */
  description = '';

  size = 'shrink';

  editing: boolean;

  /**
   * Commit message constructed from user input.
   */
  private get message(): string {
    if (!this.summary) {
      throw Error('cannot construct commit message without summary.');
    }
    if (!this.description) {
      return this.summary;
    }
    return this.summary + '\n\n' + this.description + '\n';
  }

  constructor(private commitService: CommitService) { }

  ngOnInit(): void {
    this.commitable = this.isCommitable();
  }

  updateSummary(v: string): void {
    this.summary = v;
    this.commitable = this.isCommitable();
  }

  isCommitable(): boolean {
    return this._hasStaged && !!this.summary;
  }

  commit(): void {
    // make the state uncommitable to prevent execute before the previous
    // one.
    this.commitable = false;

    this.commitService.commit(this.repositoryPath, this.message).subscribe(() => {
      this.summary = '';
      this.description = '';
      this.commitable = this.isCommitable();
      this.commitDone.emit();
    });
  }

  onMouseEnter(): void {
    this.size = 'expand';
  }
  onMouseLeave(): void {
    if (!this.editing && !this.summary) {
      this.size = 'shrink';
    }
  }
}
