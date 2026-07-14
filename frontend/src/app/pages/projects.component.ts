import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RevealDirective } from '../core/directives/reveal.directive';
import { PortfolioApiService } from '../core/services/portfolio-api.service';
import { SeoService } from '../core/services/seo.service';
import { ProjectCardComponent } from '../shared/components/project-card.component';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, TranslateModule, RevealDirective, ProjectCardComponent, SectionHeadingComponent],
  template: `
    <section class="section container page-top">
      <app-section-heading
        [eyebrow]="'projects.eyebrow' | translate"
        [title]="'projects.title' | translate"
        [subtitle]="'projects.subtitle' | translate" />

      <div class="toolbar" appReveal>
        <input class="toolbar__search" type="search"
               [placeholder]="'projects.search' | translate"
               [ngModel]="query()" (ngModelChange)="query.set($event)"
               [attr.aria-label]="'projects.search' | translate" />
        <div class="toolbar__filters" role="group" aria-label="Filter by category">
          <button [class.active]="filter() === 'all'" (click)="filter.set('all')">
            {{ 'projects.all' | translate }}
          </button>
          @for (cat of categories; track cat) {
            <button [class.active]="filter() === cat" (click)="filter.set(cat)">
              {{ 'projects.categories.' + cat | translate }}
            </button>
          }
        </div>
      </div>

      @if (filtered().length; as count) {
        <div class="grid">
          @for (project of filtered(); track project.id; let i = $index) {
            <div appReveal [revealDelay]="(i % 2) * 100">
              <app-project-card [project]="project" />
            </div>
          }
        </div>
      } @else if (projects()) {
        <p class="empty glass">{{ 'projects.empty' | translate }}</p>
      } @else {
        <div class="grid">
          @for (i of [1,2,3,4]; track i) { <div class="skeleton" style="height:380px"></div> }
        </div>
      }
    </section>
  `,
  styles: [`
    .page-top { padding-top: calc(68px + var(--section-y)); }
    .toolbar { display: grid; gap: 1rem; margin-bottom: 2.2rem; }
    .toolbar__search {
      width: min(420px, 100%);
      padding: 0.75rem 1.1rem;
      border-radius: 12px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--text-strong);
      font: 500 0.95rem var(--font-sans);
    }
    .toolbar__search:focus { border-color: var(--cyan); outline: none; }
    .toolbar__filters { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .toolbar__filters button {
      padding: 0.45rem 1rem;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: transparent;
      color: var(--text-muted);
      font: 500 0.85rem var(--font-sans);
      cursor: pointer;
      transition: all var(--transition);
    }
    .toolbar__filters button:hover { border-color: var(--cyan); color: var(--text-strong); }
    .toolbar__filters button.active {
      background: var(--gradient-brand);
      border-color: transparent;
      color: #fff;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.4rem;
    }
    .empty { padding: 2rem; text-align: center; color: var(--text-muted); }
  `]
})
export class ProjectsComponent implements OnInit {
  private readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);

  readonly categories = ['enterprise', 'angular', 'cloud'];
  readonly query = signal('');
  readonly filter = signal('all');
  readonly projects = toSignal(this.api.projects$);

  readonly filtered = computed(() => {
    const all = this.projects() ?? [];
    const q = this.query().toLowerCase().trim();
    return all.filter(p =>
      (this.filter() === 'all' || p.categories.includes(this.filter())) &&
      (!q || [p.title, p.description, ...p.technologies].join(' ').toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    this.seo.set('Projects', 'Case studies: a full-stack e-commerce platform and a personal finance manager, built end to end.');
  }
}
