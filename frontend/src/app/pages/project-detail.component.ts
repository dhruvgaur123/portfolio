import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RevealDirective } from '../core/directives/reveal.directive';
import { PortfolioApiService } from '../core/services/portfolio-api.service';
import { SeoService } from '../core/services/seo.service';
import { ArchitectureDiagramComponent } from '../shared/components/architecture-diagram.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, TranslateModule, RevealDirective, ArchitectureDiagramComponent],
  template: `
    @if (project(); as p) {
      <article class="section container page-top">
        <a routerLink="/projects" class="back mono-label">← {{ 'projects.detail.back' | translate }}</a>
        <header appReveal>
          <span class="mono-label">{{ p.timeline }}</span>
          <h1>{{ p.title }}</h1>
          <p class="lead">{{ p.description }}</p>
          <div class="links">
            <a [href]="p.github" target="_blank" rel="noopener" class="btn btn--primary">{{ 'projects.code' | translate }}</a>
            <a [href]="p.demo" target="_blank" rel="noopener" class="btn btn--ghost">{{ 'projects.demo' | translate }}</a>
          </div>
        </header>

        <div class="diagram glass" appReveal>
          <span class="mono-label">{{ 'projects.detail.architecture' | translate }}</span>
          <app-architecture-diagram [id]="p.id" />
        </div>

        <div class="cols">
          <section appReveal>
            <h2>{{ 'projects.detail.overview' | translate }}</h2>
            <p>{{ p.architecture }}</p>
            <h2>{{ 'projects.detail.challenges' | translate }}</h2>
            <p>{{ p.challenges }}</p>
            <h2>{{ 'projects.detail.solutions' | translate }}</h2>
            <p>{{ p.solutions }}</p>
            <h2>{{ 'projects.detail.lessons' | translate }}</h2>
            <p>{{ p.lessons }}</p>
          </section>

          <aside class="side">
            <div class="glass panel" appReveal [revealDelay]="100">
              <h3>{{ 'projects.detail.stack' | translate }}</h3>
              <ul class="chips">@for (t of p.technologies; track t) { <li>{{ t }}</li> }</ul>
            </div>
            <div class="glass panel" appReveal [revealDelay]="180">
              <h3>{{ 'projects.detail.features' | translate }}</h3>
              <ul class="list">@for (f of p.features; track f) { <li>{{ f }}</li> }</ul>
            </div>
            <div class="glass panel" appReveal [revealDelay]="260">
              <h3>{{ 'projects.detail.future' | translate }}</h3>
              <ul class="list">@for (f of p.future; track f) { <li>{{ f }}</li> }</ul>
            </div>
          </aside>
        </div>

        <section class="code glass" appReveal>
          <div class="code__bar">
            <span class="mono-label">{{ 'projects.detail.snippet' | translate }}</span>
          </div>
          <pre><code>{{ p.snippet }}</code></pre>
        </section>
      </article>
    } @else {
      <div class="section container page-top">
        <div class="skeleton" style="height: 60vh"></div>
      </div>
    }
  `,
  styles: [`
    .page-top { padding-top: calc(68px + var(--section-y)); }
    .back { display: inline-block; margin-bottom: 1.4rem; }
    .lead { font-size: 1.15rem; color: var(--text-muted); max-width: 60ch; }
    .links { display: flex; gap: 0.8rem; margin-top: 1.2rem; }
    .diagram {
      margin-block: 2.5rem;
      padding: 1.6rem 1.5rem 1.2rem;
    }
    .diagram .mono-label { display: block; margin-bottom: 1rem; }
    .cols { display: grid; grid-template-columns: 1.4fr 1fr; gap: 2.5rem; }
    .cols h2 { font-size: 1.2rem; margin-top: 1.6rem; }
    .side { display: grid; gap: 1.2rem; align-content: start; }
    .panel { padding: 1.3rem; }
    .panel h3 { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
    .chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.45rem; }
    .chips li { font: 500 0.78rem var(--font-mono); padding: 0.28rem 0.7rem; border-radius: 999px; border: 1px solid var(--line); }
    .list { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.4rem; }
    .code { margin-top: 2.5rem; overflow: hidden; }
    .code__bar { padding: 0.7rem 1.2rem; border-bottom: 1px solid var(--glass-border); }
    .code pre {
      margin: 0;
      padding: 1.3rem;
      background: var(--terminal-bg);
      color: #a5f3fc;
      overflow-x: auto;
      font-size: 0.85rem;
      line-height: 1.7;
    }
    @media (max-width: 860px) { .cols { grid-template-columns: 1fr; } }
  `]
})
export class ProjectDetailComponent implements OnInit {
  @Input() id = '';

  private readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);
  private readonly projects = toSignal(this.api.projects$);

  readonly project = computed(() => this.projects()?.find(p => p.id === this.id));

  ngOnInit(): void {
    this.seo.set('Project', 'Case study with architecture, challenges and lessons learned.');
  }
}
