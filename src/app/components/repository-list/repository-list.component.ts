import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Repository } from '../../models/repository';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss'],
})
export class RepositoryListComponent {
  @Input() repositories: ReadonlyArray<Repository>;
  @Output() openClick = new EventEmitter<Repository>();
  @Output() deleteClick = new EventEmitter<Repository>();
}
