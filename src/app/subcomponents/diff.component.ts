import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { HunkComponent } from './hunk.component';
import { AppWorkingFileChange } from '../models/workingfile';
import { FileDiff, Hunk, HunkLine, setHunkState } from '../models/diff';
import { DiffService } from '../services/diff.service';
import { LoggerService } from '../services/logger.service';
import { ConfirmationDialogComponent } from './confirmation-dialog.compoment';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.styl'],
})
export class DiffComponent {

  _workingfile: AppWorkingFileChange;

  @Input()
  set workingfile(v: AppWorkingFileChange) {
    if (v) {
      this._workingfile = v;
      this.getDiff();
      if (v.indexState === 'unstaged') {
        this.buttonText = 'Stage File';
        this.buttonColor = 'primary';
      } else if (v.indexState === 'staged') {
        this.buttonText = 'Unstage File';
        this.buttonColor = 'accent';
      } else {
        this.buttonText = undefined;
        this.buttonColor = undefined;
      }
    } else {
      this._workingfile = undefined;
      this.fileDiff = undefined;
      this.buttonText = undefined;
    }
  }

  /**
   * Emitted after patch has been applied successfully. Supposed to be used
   * to refresh other component.
   */
  @Output() applied = new EventEmitter<undefined>();

  /**
   * File diff retrieved from the working file change.
   */
  fileDiff: FileDiff;

  /**
   * Whether a patch can be created from the file diff. It depends on the
   * selection of lines in hunks.
   */
  editable = true;

  /**
   *
   */
  buttonText: string;
  buttonColor: string;

  constructor(
    private logger: LoggerService,
    private dialog: MatDialog,
    private diffService: DiffService) { }

  getDiff(): void {
    this.diffService.getDiff(
      this._workingfile
    ).subscribe(fileDiff => {
      this.fileDiff = fileDiff;
    });
  }

  onHunkStatusChange(): void {
    const statuses = new Set(this.fileDiff.hunks.map(h => h.selectedState));
    if (statuses.size === 1 && statuses.has('none')) {
      this.editable = false;
    } else {
      this.editable = true;
    }
  }

  apply(hunk: Hunk | undefined): void {
    if (this._workingfile.indexState === 'unstaged') {
      this.applyPatch(hunk);
    } else if (this._workingfile.indexState === 'staged') {
      this.resetPatch(hunk);
    }
  }

  discardChanges(file: AppWorkingFileChange): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: { text: 'Are you sure?' }
    });
    // this.diffService.discardChanges(file).subscribe(() => {
    //   this.logger.info(`Changes of ${file.path} discarded.`);
    // });
  }

  private applyPatch(hunk: Hunk | undefined): void {
    const patch = this.fileDiff.getPatch(hunk);
    this.diffService.applyPatch(patch).subscribe(() => {
      this.applied.emit();
    });
  }

  private resetPatch(hunk: Hunk | undefined): void {
    const hunks: Hunk[] = [];
    if (hunk) {
      hunks.push(this.copyHunk(hunk));

      const others = this.fileDiff.hunks.filter(h => h !== hunk);
      for (const h of others) {
        hunks.push(this.copyHunk(h, true));
      }
    } else {
      for (const h of this.fileDiff.hunks) {
        hunks.push(this.copyHunk(h));
      }
    }

    const newFileDiff = new FileDiff({
      path: this.fileDiff.path,
      diffInfo: this.fileDiff.diffInfo,
      hunks: hunks,
    });

    const states = new Set(newFileDiff.hunks.map(h => h.selectedState));
    let patch: string;
    if (states.size === 1 && states.has('none')) {
      // no patch available
    } else {
      patch = newFileDiff.getPatch();
    }

    this.diffService.unstageFile(
      this._workingfile.path
    ).subscribe(() => {
      if (patch) {
        this.diffService.applyPatch(patch).subscribe(() => {
          this.applied.emit();
        });
      } else {
        this.applied.emit();
      }
    });
  }

  private copyHunk(original: Hunk, selectAll = false): Hunk {
    const newLines: HunkLine[] = [];
    for (const line of original.lines) {
      newLines.push(this.copyHunkLine(line, selectAll));
    }

    const newHunk = new Hunk({
      header: original.header,
      lines: newLines,
      selectedState: 'all',
    });
    setHunkState(newHunk);
    return newHunk;
  }

  private copyHunkLine(original: HunkLine, selectAll = false): HunkLine {
    if (original.type === 'unchanged') {
      return {
        type: original.type,
        oldLineNo: original.oldLineNo,
        newLineNo: original.newLineNo,
        content: original.content,
        selected: original.selected,
        isNoNewLineWarning: original.isNoNewLineWarning,
      };
    } else {
      return {
        type: original.type,
        oldLineNo: original.oldLineNo,
        newLineNo: original.newLineNo,
        content: original.content,
        selected: selectAll ? true : !original.selected,
        isNoNewLineWarning: original.isNoNewLineWarning,
      };
    }
  }
}
