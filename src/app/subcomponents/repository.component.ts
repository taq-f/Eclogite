import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  /**
   * Get repositories opened in the past, and show them.
   */
  getRepositories(): void {
    this.repositoryService.getRecentlyOpenedRepositories().subscribe(repositories => {
      this.recentlyOpenedRepositories = repositories;
    });
    this.repositoryService.getRepositories().subscribe(repositories => {
      // The list of all repositories sorted in alphabetical order of repository name.
      this.repositories = repositories
        .sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
    });
  }

  /**
   * Let the user select the git repository directory with native file select
   * dialog.
   */
  chooseRepositoryPath(): void {
    // When showOpenDialog is executed as asynchronous mode, choose button
    // won't go back to unselected state after closing the dialog.
    const path = remote.dialog.showOpenDialog({
      title: 'Repository Path',
      properties: ['openDirectory'],
    });
    if (!path) {
      return;
    }

    this.repositoryPath = path[0];
  }

  /**
   * Add a rpository. This lets the repository to be opened immediately
   * after it's saved.
   */
  addRepository(): void {
    const path = this.repositoryPath;
    const repository = {
      id: sha256(path),
      path: path,
      name: basename(path),
      exists: true,
    };
    this.repositoryService.addRepository(repository).subscribe(id => {
      this.repositoryPath = path;
      this.openRepository(repository);
    });
  }

  /**
   * Select and open a repository.
   */
  openRepository(repository: Repository): void {
    this.router.navigate([`/workingfiles/${repository.id}`]);
  }

  /**
   * Delete a repotository from saved list. This won't delete actual
   * directory of the repository.
   */
  deleteRepository(repository: Repository): void {
    this.repositoryService.deleteRepository(repository.id).subscribe(id => {
      // Make sure to refresh repositoris list.
      this.getRepositories();
    });
  }
}
