import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RevealDirective } from '../core/directives/reveal.directive';
import { PortfolioApiService } from '../core/services/portfolio-api.service';
import { SeoService } from '../core/services/seo.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, RevealDirective, SectionHeadingComponent],
  template: `
    <section class="section container page-top">
      <app-section-heading
        [eyebrow]="'experience.eyebrow' | translate"
        [title]="'experience.title' | translate" />

      <ol class="timeline">
        @for (job of api.experience$ | async; track job.id; let i = $index) {
          <li class="timeline__item" appReveal [revealDelay]="i * 120">
            <div class="timeline__marker" aria-hidden="true"></div>
            <article class="glass timeline__card">
              <header class="timeline__head">
                <div>
                  <h3>{{ job.role }}</h3>
                  <p class="timeline__company">{{ job.company }} · {{ job.location }}</p>
                </div>
                <span class="mono-label">{{ job.duration }}</span>
              </header>
              <p class="timeline__summary">{{ job.summary }}</p>
              <ul class="timeline__badges" [attr.aria-label]="'experience.technologies' | translate">
                @for (tech of job.technologies; track tech) { <li>{{ tech }}</li> }
              </ul>

              <button class="timeline__toggle" (click)="toggle(job.id)" [attr.aria-expanded]="isOpen(job.id)">
                {{ (isOpen(job.id) ? 'experience.collapse' : 'experience.expand') | translate }}
                <span [class.rot]="isOpen(job.id)" aria-hidden="true">▾</span>
              </button>

              @if (isOpen(job.id)) {
                <div class="timeline__details">
                  <h4>{{ 'experience.responsibilities' | translate }}</h4>
                  <ul>@for (r of job.responsibilities; track r) { <li>{{ r }}</li> }</ul>
                  <h4>{{ 'experience.achievements' | translate }}</h4>
                  <ul>@for (a of job.achievements; track a) { <li>{{ a }}</li> }</ul>
                </div>
              }
            </article>
          </li>
        }
      </ol>
    </section>
  `,
  styles: [`
    .page-top { padding-top: calc(68px + var(--section-y)); }
    .timeline {
      list-style: none;
      margin: 0;
      padding: 0;
      position: relative;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 9px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: linear-gradient(var(--blue), var(--cyan), var(--purple));
      opacity: 0.6;
    }
    .timeline__item { position: relative; padding-left: 2.6rem; margin-bottom: 1.8rem; }
    .timeline__marker {
      position: absolute;
      left: 0;
      top: 1.3rem;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--bg);
      border: 3px solid var(--cyan);
      box-shadow: 0 0 0 5px color-mix(in srgb, var(--cyan) 18%, transparent);
    }
    .timeline__card { padding: 1.5rem 1.6rem; }
    .timeline__head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .timeline__head h3 { margin-bottom: 0.15rem; }
    .timeline__company { color: var(--text-muted); margin: 0; }
    .timeline__summary { margin-top: 0.9rem; }
    .timeline__badges {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding: 0;
      margin: 0 0 1rem;
    }
    .timeline__badges li {
      font: 500 0.75rem var(--font-mono);
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      border: 1px solid var(--line);
      color: var(--text-muted);
    }
    .timeline__toggle {
      background: none;
      border: 0;
      color: var(--cyan);
      font: 600 0.9rem var(--font-sans);
      cursor: pointer;
      display: inline-flex;
      gap: 0.4rem;
      padding: 0;
    }
    .timeline__toggle span { transition: transform var(--transition); }
    .timeline__toggle .rot { transform: rotate(180deg); }
    .timeline__details { margin-top: 1rem; animation: open 250ms ease; }
    .timeline__details h4 { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.4rem; }
    .timeline__details ul { margin: 0 0 1rem; padding-left: 1.2rem; display: grid; gap: 0.35rem; }
    @keyframes open { from { opacity: 0; transform: translateY(-6px); } }
  `]
})
export class ExperienceComponent implements OnInit {
  readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);
  private readonly open = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.seo.set('Experience', 'Roles at Donat IT, Wipro and Accenture — the stacks, responsibilities and outcomes.');
  }

  isOpen(id: string): boolean {
    return this.open().has(id);
  }

  toggle(id: string): void {
    const next = new Set(this.open());
    next.has(id) ? next.delete(id) : next.add(id);
    this.open.set(next);
  }
}
