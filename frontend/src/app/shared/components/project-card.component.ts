import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '../../data/portfolio.models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <article class="card glass" (mousemove)="tilt($event)" (mouseleave)="reset($event)">
      <a [routerLink]="['/projects', project.id]" class="card__media" [attr.aria-label]="project.title">
        <div class="card__art" aria-hidden="true">
          <span class="mono-label">{{ project.id }}.ts</span>
          <pre>{{ project.snippet.split('\n')[0] }}</pre>
        </div>
      </a>
      <div class="card__body">
        <h3><a [routerLink]="['/projects', project.id]">{{ project.title }}</a></h3>
        <p class="card__desc">{{ project.description }}</p>
        <ul class="card__badges" aria-label="Technologies">
          @for (tech of project.technologies.slice(0, 4); track tech) {
            <li>{{ tech }}</li>
          }
        </ul>
        <div class="card__actions">
          <a [routerLink]="['/projects', project.id]" class="btn btn--primary">{{ 'projects.viewCase' | translate }}</a>
          <a [href]="project.github" target="_blank" rel="noopener" class="btn btn--ghost">{{ 'projects.code' | translate }}</a>
          <a [href]="project.demo" target="_blank" rel="noopener" class="btn btn--ghost">{{ 'projects.demo' | translate }}</a>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 160ms ease, box-shadow var(--transition), border-color var(--transition);
      will-change: transform;
    }
    .card:hover { box-shadow: var(--shadow); border-color: color-mix(in srgb, var(--blue) 45%, transparent); }
    .card__media { display: block; }
    .card__art {
      background: var(--terminal-bg);
      padding: 1.4rem;
      min-height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-bottom: 1px solid var(--glass-border);
    }
    .card__art pre {
      margin: 0;
      color: #7dd3fc;
      font-size: 0.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card__body { padding: 1.4rem; display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
    .card__body h3 a { color: var(--text-strong); }
    .card__body h3 a:hover { color: var(--cyan); }
    .card__desc { color: var(--text-muted); font-size: 0.95rem; flex: 1; }
    .card__badges {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding: 0;
      margin: 0 0 1rem;
    }
    .card__badges li {
      font: 500 0.75rem var(--font-mono);
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      border: 1px solid var(--line);
      color: var(--text-muted);
    }
    .card__actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }
    .card__actions .btn { padding: 0.55rem 1.1rem; font-size: 0.85rem; }
  `]
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;

  /** Subtle pointer-tracking tilt; disabled for reduced-motion users. */
  tilt(event: MouseEvent): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
  }

  reset(event: MouseEvent): void {
    (event.currentTarget as HTMLElement).style.transform = '';
  }
}
