import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RevealDirective } from '../core/directives/reveal.directive';
import { PortfolioApiService } from '../core/services/portfolio-api.service';
import { SeoService } from '../core/services/seo.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';
import { SkillCardComponent } from '../shared/components/skill-card.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, RevealDirective, SectionHeadingComponent, SkillCardComponent],
  template: `
    <section class="section container page-top">
      <app-section-heading
        [eyebrow]="'skills.eyebrow' | translate"
        [title]="'skills.title' | translate"
        [subtitle]="'skills.subtitle' | translate" />

      @if (api.skills$ | async; as categories) {
        @for (category of categories; track category.category) {
          <div class="skills__group">
            <h3 class="skills__category mono-label" appReveal>
              {{ 'skills.categories.' + category.category | translate }}
            </h3>
            <div class="skills__grid">
              @for (skill of category.skills; track skill.name; let i = $index) {
                <div appReveal [revealDelay]="i * 60">
                  <app-skill-card [skill]="skill" />
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <div class="skills__grid">
          @for (i of [1,2,3,4,5,6]; track i) { <div class="skeleton" style="height:120px"></div> }
        </div>
      }
    </section>
  `,
  styles: [`
    .page-top { padding-top: calc(68px + var(--section-y)); }
    .skills__group { margin-bottom: 2.8rem; }
    .skills__category { display: block; font-size: 0.95rem; margin-bottom: 1.1rem; }
    .skills__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 1.1rem;
    }
  `]
})
export class SkillsComponent implements OnInit {
  readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set('Skills', 'Frontend, backend, database, cloud and tooling skills with proficiency levels.');
  }
}
