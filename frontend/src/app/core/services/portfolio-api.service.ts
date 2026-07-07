import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Experience, Profile, Project, SkillCategory } from '../../data/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  readonly profile$: Observable<Profile> =
    this.http.get<Profile>(`${this.base}/profile`).pipe(shareReplay(1));

  readonly skills$: Observable<SkillCategory[]> =
    this.http.get<SkillCategory[]>(`${this.base}/skills`).pipe(shareReplay(1));

  readonly experience$: Observable<Experience[]> =
    this.http.get<Experience[]>(`${this.base}/experience`).pipe(shareReplay(1));

  readonly projects$: Observable<Project[]> =
    this.http.get<Project[]>(`${this.base}/projects`).pipe(shareReplay(1));

  sendContact(payload: { name: string; email: string; subject: string; message: string; website: string }) {
    return this.http.post<{ status: string }>(`${this.base}/contact`, payload);
  }
}
