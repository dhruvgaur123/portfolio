import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RevealDirective } from '../core/directives/reveal.directive';
import { SeoService } from '../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslateModule, RevealDirective],
  template: `
    <section class="section container page-top">
      <div appReveal>
        <span class="mono-label"># {{ 'about.eyebrow' | translate }}</span>
        <h1>{{ 'about.title' | translate }}</h1>
      </div>

      <div class="about">
        <div class="about__bio" appReveal>
          <p>{{ 'about.bio1' | translate }}</p>
          <p>{{ 'about.bio2' | translate }}</p>

          <h3>{{ 'about.philosophyTitle' | translate }}</h3>
          <ol class="about__philosophy">
            @for (key of ['about.philosophy1', 'about.philosophy2', 'about.philosophy3']; track key) {
              <li>{{ key | translate }}</li>
            }
          </ol>
        </div>

        <aside class="about__side">
          <div class="glass about__panel" appReveal [revealDelay]="100">
            <h3>{{ 'about.industriesTitle' | translate }}</h3>
            <ul class="about__chips">
              @for (item of ('about.industries' | translate); track item) { <li>{{ item }}</li> }
            </ul>
          </div>
          <div class="glass about__panel" appReveal [revealDelay]="200">
            <h3>{{ 'about.softTitle' | translate }}</h3>
            <ul class="about__chips">
              @for (item of ('about.soft' | translate); track item) { <li>{{ item }}</li> }
            </ul>
          </div>
          <div class="glass about__panel" appReveal [revealDelay]="300">
            <h3>{{ 'about.achievementsTitle' | translate }}</h3>
            <ul class="about__list">
              @for (item of ('about.achievements' | translate); track item) { <li>{{ item }}</li> }
            </ul>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .page-top { padding-top: calc(68px + var(--section-y)); }
    .about {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 2.5rem;
      margin-top: 1rem;
    }
    .about__philosophy { padding-left: 1.2rem; display: grid; gap: 0.6rem; }
    .about__philosophy li::marker { font-family: var(--font-mono); color: var(--cyan); }
    .about__side { display: grid; gap: 1.2rem; align-content: start; }
    .about__panel { padding: 1.4rem; }
    .about__panel h3 { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
    .about__chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .about__chips li {
      font: 500 0.8rem var(--font-mono);
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
      border: 1px solid var(--line);
    }
    .about__list { margin: 0; padding-left: 1.1rem; display: grid; gap: 0.5rem; }
    @media (max-width: 860px) { .about { grid-template-columns: 1fr; } }
  `]
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set('About', 'Full stack developer in Ingolstadt, Germany, with nearly a decade of experience across automotive, manufacturing, finance and energy.');
  }
}
