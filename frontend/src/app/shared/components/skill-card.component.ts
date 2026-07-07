import { Component, ElementRef, Input, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Skill } from '../../data/portfolio.models';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <article class="card glass">
      <div class="card__top">
        <span class="card__icon" aria-hidden="true">{{ initials }}</span>
        <div>
          <h3 class="card__name">{{ skill.name }}</h3>
          <span class="card__years mono-label">{{ 'skills.years' | translate: { years: skill.years } }}</span>
        </div>
      </div>
      <div class="card__meter" role="meter" [attr.aria-valuenow]="skill.level"
           aria-valuemin="0" aria-valuemax="100" [attr.aria-label]="skill.name">
        <div class="card__fill" [style.width.%]="animated() ? skill.level : 0"></div>
      </div>
    </article>
  `,
  styles: [`
    .card {
      padding: 1.2rem 1.3rem;
      transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
    }
    .card:hover {
      transform: translateY(-5px);
      border-color: color-mix(in srgb, var(--cyan) 50%, transparent);
      box-shadow: var(--shadow);
    }
    .card__top { display: flex; gap: 0.9rem; align-items: center; margin-bottom: 1rem; }
    .card__icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--gradient-brand);
      color: #fff;
      font: 700 0.85rem var(--font-mono);
      flex-shrink: 0;
    }
    .card__name { margin: 0; font-size: 1rem; }
    .card__meter {
      height: 6px;
      border-radius: 999px;
      background: var(--surface);
      overflow: hidden;
    }
    .card__fill {
      height: 100%;
      border-radius: inherit;
      background: var(--gradient-brand);
      transition: width 900ms cubic-bezier(0.22, 1, 0.36, 1);
    }
  `]
})
export class SkillCardComponent implements OnInit {
  @Input({ required: true }) skill!: Skill;

  readonly animated = signal(false);
  private readonly el = inject(ElementRef<HTMLElement>);

  get initials(): string {
    return this.skill.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
  }

  ngOnInit(): void {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.animated.set(true);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(this.el.nativeElement);
  }
}
