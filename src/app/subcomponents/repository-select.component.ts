import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Repository } from '../models/repository';
import { RepositoryService } from '../services/repository.service';

@Component({
  selector: 'app-repository-select',
  templateUrl: './repository-select.component.html',
  styleUrls: ['./repository-select.component.css'],
})
export class RepositorySelectComponent implements OnInit {

    repositories: ReadonlyArray<Repository>;

    constructor(
        public dialogRef: MatDialogRef<RepositorySelectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private repositoryService: RepositoryService) { }

    ngOnInit(): void {
      this.repositoryService.getRepositories().subscribe(repositories => {
        this.repositories = repositories;
      });
    }

    selectRepository(repository: Repository):void {
      this.dialogRef.close(repository);
    }

    deleteRepository(repository: Repository): void {
      const r = this.repositories.filter(r => r !== repository);
      this.repositories = r;
      // TODO inform the deletion to main process.
    }
}
