import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { LoggerService } from './logger.service';
import { Repository } from '../models/repository';

interface SavedRepository {
  readonly id: string;
  lastOpen: number;
  readonly repository: Repository;
}

@Injectable()
export class RepositoryService {
  private currentRepository = new Subject<Repository>();
  currentRepository$ = this.currentRepository.asObservable();

  constructor(private logger: LoggerService) { }

  setCurrentRepository(repository: Repository): void {
    this.logger.info('Repository change request:', repository.name);
    this.saveLastOpenRepository(repository.id).subscribe(() => {
      this.currentRepository.next(repository);
    });
  }

  addRepository(repository: Repository): Observable<string> {
    const data = localStorage.getItem('repositories');
    let list;
    if (!data) {
      list = [];
    } else {
      list = JSON.parse(data);
    }

    list.push({
      id: repository.id,
      lastOpen: Date.now(),
      repository,
    });
    localStorage.setItem('repositories', JSON.stringify(list));

    return of(repository.id);
  }

  getRepositories(): Observable<Repository[]> {
    const data = localStorage.getItem('repositories');
    if (!data) {
      return of([]);
    }
    const list = JSON.parse(data) as SavedRepository[];
    return of(list.map(s => s.repository));
  }

  getRepository(id: string): Observable<Repository> {
    const data = localStorage.getItem('repositories');
    if (!data) {
      return of(undefined);
    }
    const list = JSON.parse(data) as SavedRepository[];
    return of(list.find(r => r.id === id).repository);
  }

  saveLastOpenRepository(id: string): Observable<void> {
    localStorage.setItem('lastOpenRepositoryId', id);
    return of(undefined);
  }

  getLastOpenRepository(): Observable<Repository> {
    const id = localStorage.getItem('lastOpenRepositoryId');
    if (!id) {
      return of(undefined);
    } else {
      const data = localStorage.getItem('repositories');
      if (!data) {
        return of(undefined);
      }
      const list = JSON.parse(data) as SavedRepository[];
      const saved = list.find(r => r.id === id);
      return of(saved.repository);
    }
  }

  deleteRepository(id: string): Observable<string> {
    const data = localStorage.getItem('repositories');
    if (!data) {
      return of(undefined);
    }
    const list = JSON.parse(data) as SavedRepository[];
    const index = list.findIndex(s => s.id === id);
    if (index < 0) {
      return of(undefined);
    } else {
      list.splice(index, 1);
      localStorage.setItem('repositories', JSON.stringify(list));
      return of(id);
    }
  }

  getRecentlyOpenedRepositories(howMany = 3): Observable<ReadonlyArray<Repository>> {
    const data = localStorage.getItem('repositories');
    if (!data) {
      return of([]);
    }
    const list = JSON.parse(data) as SavedRepository[];
    const sorted = list.sort((a, b) => b.lastOpen - a.lastOpen);

    return of(sorted.map(s => s.repository).slice(0, howMany));
  }
}
