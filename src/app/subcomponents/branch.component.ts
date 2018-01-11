import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { BranchService } from '../services/branch.service';
import { RepositoryService } from '../services/repository.service';
import { Branch } from '../models/branch';
import { Repository } from '../models/repository';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.styl'],
})
export class BranchComponent implements OnInit {
  repository: Repository;
  branches: ReadonlyArray<Branch>;

  constructor(
    private logger: LoggerService,
    private branchService: BranchService,
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
          this.getBranch();
        });
      });
    } else {
      this.repositoryService.getLastOpenRepository(true).subscribe(repository => {
        if (!repository) {
          this.router.navigate(['/repository']);
        }
        this.repository = repository;
        this.getBranch();
      });
    }
  }

  getBranch(): void {
    this.branchService.branches(this.repository.path).subscribe(branches => {
      this.logger.info(branches);
      this.branches = branches;
    });
  }

  checkout(branch: Branch): void {
    this.logger.info('switch to branch', branch);
    this.branchService.checkout(
      this.repository.path,
      branch.name
    ).subscribe(() => {
      this.logger.info('switch done');
      this.getBranch();
    });
  }
}
