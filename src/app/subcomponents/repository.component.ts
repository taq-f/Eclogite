import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { remote } from 'electron';
import { sha256 } from 'js-sha256';
import { basename } from 'path';

import { RepositoryService } from '../services/repository.service';
import { Repository } from '../models/repository';


@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css'],
})
export class RepositoryComponent implements OnInit {

  recentlyOpenedRepositories: ReadonlyArray<Repository>;
  repositories: ReadonlyArray<Repository>;
  repositoryPath: string;

  constructor(
    private router: Router,
    private repositoryService: RepositoryService) { }

  ngOnInit(): void {
    this.getRepositories();
  }

  getRepositories(): void {
    this.repositoryService.getRecentlyOpenedRepositories().subscribe(repositories => {
      this.recentlyOpenedRepositories = repositories;
    });
    this.repositoryService.getRepositories().subscribe(repositories => {
      this.repositories = repositories
        .sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    });
  }

  choosePathSelectDialog(): void {
    const path = remote.dialog.showOpenDialog({
      title: 'Repository Path',
      properties: ['openDirectory'],
    });
    if (!path) {
      return;
    }

    this.repositoryPath = path[0];
  }

  openRepository(): void {
    const path = this.repositoryPath;
    const toId = (data: string): string => sha256(data);
    this.repositoryService.addRepository({
      id: toId(path),
      path: path,
      name: basename(path),
      exists: true,
    }).subscribe(id => {
      this.repositoryPath = path;
      this.router.navigate([`/workingfiles/${id}`]);
    });
  }

  selectRepository(repository: Repository): void {
    this.router.navigate([`/workingfiles/${repository.id}`]);
  }

  deleteRepository(repository: Repository): void {
    this.repositoryService.deleteRepository(repository.id).subscribe(id => {
      this.repositoryService.getRepositories().subscribe(repositories => {
        this.repositories = repositories;
      });
    });
  }
}
