import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfigService } from '../services/config.service';
import { CommitService } from '../services/commit.service';

type MouseEventTrigger = 'enter' | 'leave';
type InputFocusTrigger = 'focus' | 'blur';

@Component({
  selector: 'app-commit',
  templateUrl: './commit.component.html',
  styleUrls: ['./commit.component.styl'],
  animations: [
    trigger('size', [
      state('expand', style({ height: '*' })),
      state('shrink', style({ height: '30px' })),
      transition('expand <=> shrink', animate('200ms ease')),
    ]),
  ],
})
export class CommitComponent implements OnInit {
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

  isMouseOver: boolean;
  isEditing: boolean;

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

  constructor(
    private configService: ConfigService,
    private commitService: CommitService) { }

  ngOnInit(): void {
    this.commitable = this.isCommitable();
    this.configService.getUser().subscribe(user => {
      // console.log(user);
    });
  }

  updateSummary(v: string): void {
    this.summary = v;
    this.commitable = this.isCommitable();
  }

  isCommitable(): boolean {
    return this._hasStaged && !!this.summary;
  }

  commit(): void {
    // Make the state uncommitable to prevent execute before the previous
    // one.
    this.commitable = false;

    this.commitService.commit(this.message).subscribe(() => {
      this.summary = '';
      this.description = '';
      this.commitable = this.isCommitable();
      this.commitDone.emit();
    });
  }

  toggleMouseoverState(t: MouseEventTrigger): void {
    if (t === 'enter') {
      // Force open.
      this.size = 'expand';
      this.isMouseOver = true;
    } else if (t === 'leave') {
      // The commit area can be closed as long as its inputs are not focused
      // nor no input has been made.
      if (!this.summary && !this.isEditing) {
        this.size = 'shrink';
      }
      this.isMouseOver = false;
    } else {
      throw new Error(`unknown trigger: ${t}`);
    }
  }

  toggleInputFocusState(t: InputFocusTrigger): void {
    if (t === 'focus') {
      // Force open.
      this.size = 'expand';
      this.isEditing = true;
    } else if (t === 'blur') {
      // The commit area can be closed as long as the mouse is not on the area
      // nor no input has been made.
      if (!this.isMouseOver && !this.summary) {
        this.size = 'shrink';
      }
      this.isEditing = false;
    } else {
      throw new Error(`unknown trigger: ${t}`);
    }
  }
}
