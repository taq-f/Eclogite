import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Hunk, Line } from '../models/diff';
import { DiffService } from '../services/diff.service';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css'],
  animations: [
    trigger('select', [
      state('unselected', style({ backgroundColor: 'transparent' })),
      state('selected', style({ backgroundColor: '#CFD8DC' })),
      transition('unselected <=> selected', animate('200ms ease')),
    ])
  ]
})
export class DiffComponent implements OnInit {

  hunks: ReadonlyArray<Hunk>;

  constructor(private diffService: DiffService) { }

  ngOnInit(): void {
    this.diffService.getDiff('', '').subscribe(hunks => {
      this.hunks = hunks;
    });
  }
}
