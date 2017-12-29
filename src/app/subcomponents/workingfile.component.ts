import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RepositoryService } from '../services/repository.service';
import { AppWorkingFileChange } from '../models/workingfile';
import { Repository } from '../models/repository';

@Component({
  selector: 'app-workingfile',
  templateUrl: './workingfile.component.html',
  styleUrls: ['./workingfile.component.css']
})
export class WorkingfileComponent implements OnInit {
  /**
   * The currently opened repository.
   */
  repository: Repository;

  /**
   * The target file of diff.
   */
  filepath: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repositoryService: RepositoryService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('repositoryId');
    if (id) {
      this.repositoryService.saveLastOpenRepository(id).subscribe(() => {
        this.repositoryService.getRepository(id).subscribe(repository => {
          this.repository = repository;
        });
      });
    } else {
      this.repositoryService.getLastOpenRepository(true).subscribe(repository => {
        if (!repository) {
          this.router.navigate(['/repository']);
        }
        this.repository = repository;
      });
    }
  }

  onEntrySelectChange(v: AppWorkingFileChange): void {
    this.filepath = v.path;
  }
}
