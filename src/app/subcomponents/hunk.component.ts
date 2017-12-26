import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Hunk, Line } from '../models/diff';

type SelectState = 'all' | 'partial' | 'none';

interface SelectableLine extends Line {
  selected: boolean;
}

interface HeaderLine extends Line {
  state: SelectState;
}


@Component({
  selector: 'app-hunk',
  templateUrl: './hunk.component.html',
  styleUrls: ['./hunk.component.css'],
  animations: [
    trigger('select', [
      state('unselected', style({ backgroundColor: 'transparent' })),
      state('selected', style({ backgroundColor: '#CFD8DC' })),
      transition('unselected <=> selected', animate('200ms ease')),
    ])
  ]
})
export class HunkComponent {

  header: HeaderLine;

  _lines: Line[];

  @Input()
  set lines(v: Line[]) {
    const headerLine = v[0];
    this.header = {
      type: headerLine.type,
      lineNoBefore: headerLine.lineNoBefore,
      lineNoAfter: headerLine.lineNoAfter,
      content: headerLine.content,
      state: 'all',
    };

    this._lines = v.slice(1).map(line => {
      if (line.type !== 'unchanged') {
        return {
          type: line.type,
          lineNoBefore: line.lineNoBefore,
          lineNoAfter: line.lineNoAfter,
          content: line.content,
          selected: true,
        }
      } else {
        return {
          type: line.type,
          lineNoBefore: line.lineNoBefore,
          lineNoAfter: line.lineNoAfter,
          content: line.content,
        }
      }
    });
  }

  toggleSelected(line: Line): void {
    if (line.type === 'header') {
      const l = <HeaderLine>line;
      const currentState = l.state;
      
      switch (currentState) {
        case 'all':
          // to none
          this._lines.forEach((element: SelectableLine) => {
            element.selected = false;
          });
          l.state = 'none';
          break;
        case 'partial':
          // to none
          this._lines.forEach((element: SelectableLine) => {
            element.selected = false;
          });
          l.state = 'none';
          break;
        case 'none':
          // to all
          this._lines.forEach((element: SelectableLine) => {
            element.selected = true;
          });
          l.state = 'all';
        default:
          break;
      }
    } else if (line.type === 'plus' || line.type === 'minus') {
      const l = <SelectableLine>line;
      l.selected = !l.selected;

      // set header state
      let allTrue = true;
      let allFalse = true;

      this._lines.forEach((l: SelectableLine) => {
        if (l.type === 'unchanged') {
          return;
        }
        if (l.selected) {
          allFalse = false;
        } else {
          allTrue = false;
        }
      });

      if (allTrue) {
        this.header.state = 'all';
      } else if (allFalse) {
        this.header.state = 'none';
      } else {
        this.header.state = 'partial';
      }
    }
  }
}
