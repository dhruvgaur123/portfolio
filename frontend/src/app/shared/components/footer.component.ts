import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <footer class="footer">
      <div class="container footer__grid">
        <div>
          <a routerLink="/" class="footer__logo"><span>~/</span>dhruv-gaur</a>
          <p class="footer__tagline">{{ 'footer.tagline' | translate }}</p>
          <div class="footer__social">
            <a href="https://github.com/dhruvgaur123" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
            <a href="https://linkedin.com/in/dhruv-gaur" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
            <a href="mailto:dhruvgaur1124@gmail.com" aria-label="Email">Email</a>
          </div>
        </div>
        <nav aria-label="Footer">
          <h3 class="footer__title">{{ 'footer.navTitle' | translate }}</h3>
          <a routerLink="/about">{{ 'nav.about' | translate }}</a>
          <a routerLink="/projects">{{ 'nav.projects' | translate }}</a>
          <a routerLink="/contact">{{ 'nav.contact' | translate }}</a>
        </nav>
        <nav aria-label="Legal">
          <h3 class="footer__title">{{ 'footer.legalTitle' | translate }}</h3>
          <a href="#">{{ 'footer.privacy' | translate }}</a>
          <a href="#">{{ 'footer.terms' | translate }}</a>
        </nav>
      </div>
      <div class="container footer__bottom">
        <span>© {{ year }} Dhruv Gaur. {{ 'footer.rights' | translate }}</span>
        <a href="#main">{{ 'footer.backToTop' | translate }} ↑</a>
      </div>
    </footer>
  `,
  styles: [`
    .footer { border-top: 1px solid var(--line); padding-block: 3.5rem 1.5rem; }
    .footer__grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2rem;
    }
    .footer__logo { font: 700 1.05rem var(--font-mono); color: var(--text-strong); }
    .footer__logo span { color: var(--cyan); }
    .footer__tagline { color: var(--text-muted); margin-top: 0.8rem; max-width: 32ch; }
    .footer__social { display: flex; gap: 1rem; }
    .footer__title { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
    nav a { display: block; color: var(--text); padding-block: 0.25rem; }
    nav a:hover { color: var(--cyan); }
    .footer__bottom {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 3rem;
      padding-top: 1.4rem;
      border-top: 1px solid var(--line);
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    @media (max-width: 700px) { .footer__grid { grid-template-columns: 1fr; } }
  `]
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
