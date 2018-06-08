import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { AppStatusEntry, AppWorkingFileChange, IndexState } from '../../models/workingfile';
import { LoggerService } from '../../services/logger.service';
import { StatusService } from '../../services/status.service';
import { Repository } from '../../models/repository';
import { MatDialog } from '@angular/material';
import { DiffService } from '../../services/diff.service';
import { DiscardChangeConfirmationComponent } from '../discard-change-confirmation/discard-change-confirmation.compoment';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {

  _repository: Repository;

  @Input()
  set repository(r: Repository) {
    this.logger.info('Status component detects repository change:', r.name);
    this._repository = r;
    this.getChanges();
  }

  /**
   * Changes entries that will be placed in unstaged changes.
   */
  unstagedChanges: ReadonlyArray<AppWorkingFileChange> = [];
  /**
   * Changes entries that will be placed in staged changes.
   */
  stagedChanges: ReadonlyArray<AppWorkingFileChange> = [];
  /**
   * Changes entries that will be placed in conflicted changes.
   */
  conflictedChanges: ReadonlyArray<AppWorkingFileChange> = [];

  /**
   * A currently selected change entry.
   */
  selectedChange: AppWorkingFileChange;

  /**
   * Event fires when selected change entry changed.
   */
  @Output() entrySelectChange = new EventEmitter<AppWorkingFileChange>();

  @Output() refreshed = new EventEmitter<{
    numOfUnstaged: number,
    numOfStaged: number,
    numOfConflicted: number,
  }>();

  /**
   * This component requires StatusService to retrieve file change entries.
   */
  constructor(
    private logger: LoggerService,
    private statusService: StatusService,
    private dialog: MatDialog,
    private diffService: DiffService) { }

  getChanges(): void {
    this.statusService.getStatus(this._repository.path).subscribe(status => {
      const fileChanges = status.changes;
      const unstaged: AppWorkingFileChange[] = [];
      const staged: AppWorkingFileChange[] = [];
      const conflicted: AppWorkingFileChange[] = [];
      for (const f of fileChanges) {
        if (f.indexState === 'unstaged') {
          unstaged.push(f);
        } else if (f.indexState === 'staged') {
          staged.push(f);
        } else if (f.indexState === 'conflicted') {
          conflicted.push(f);
        }
      }

      this.unstagedChanges = unstaged;
      this.stagedChanges = staged;
      this.conflictedChanges = conflicted;

      // If there is a selected file, look for the corresponding file
      // and make it selected.
      if (this.selectedChange) {
        this.recoverSelected(this.selectedChange);
        this.entrySelectChange.emit(this.selectedChange);
      }

      this.refreshed.emit({
        numOfUnstaged: unstaged.length,
        numOfStaged: staged.length,
        numOfConflicted: conflicted.length,
      });
    });
  }

  recoverSelected(target: AppWorkingFileChange): void {
    let search: ReadonlyArray<AppWorkingFileChange>;
    switch (target.indexState) {
      case 'unstaged':
        search = this.unstagedChanges;
        break;
      case 'staged':
        search = this.stagedChanges;
        break;
      default:
        break;
    }

    const c = search.find(c => c.path === target.path);
    if (c) {
      this.selectedChange = c;
      return;
    }
    this.selectedChange = undefined;
  }

  /**
   * Select specified change entry.
   */
  selectChange(c: AppWorkingFileChange): void {
    this.selectedChange = c;
    this.entrySelectChange.emit(c);
  }

  /**
   * Stage a file.
   *
   * @param change
   */
  stageFile(change: AppWorkingFileChange): void {
    this.logger.info('stage file: not working right now', change.filename);
    this.diffService.stageFile(change.path).subscribe(() => {
      this.getChanges();
    });
  }

  /**
   * Unstage a file.
   *
   * @param change
   */
  unstageFile(change: AppWorkingFileChange): void {
    this.logger.info('unstage file');
    this.diffService.unstageFile(change.path).subscribe(() => {
      this.getChanges();
    });
  }

  /**
   * Discard changes of a file.
   *
   * @param change
   */
  discardChanges(change: AppWorkingFileChange): void {
    this.dialog.open(DiscardChangeConfirmationComponent, {
      data: { files: [change] }
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.logger.info('discard changes of', change.filename);
        this.diffService.discardChanges(change).subscribe(() => {
          this.getChanges();
        });
      }
    });
  }
}
