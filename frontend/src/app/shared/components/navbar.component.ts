import { AsyncPipe } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { selectTheme } from '../../store/ui.state';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule, AsyncPipe],
  template: `
    <header class="nav" [class.nav--solid]="scrolled() || menuOpen()">
      <div class="container nav__inner">
        <a routerLink="/" class="nav__logo" aria-label="Home">
          <span class="nav__prompt">~/</span>dhruv-gaur
        </a>

        <nav class="nav__links" [class.nav__links--open]="menuOpen()" aria-label="Primary">
          @for (link of links; track link.path) {
            <a [routerLink]="link.path" routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: link.path === '/' }"
               (click)="menuOpen.set(false)">
              {{ link.key | translate }}
            </a>
          }
        </nav>

        <div class="nav__actions">
          <button class="nav__icon-btn" (click)="switchLang()" [attr.aria-label]="'language.switch' | translate">
            {{ lang.current() === 'en' ? 'DE' : 'EN' }}
          </button>
          <button class="nav__icon-btn" (click)="theme.toggle()" [attr.aria-label]="'theme.toggle' | translate">
            {{ (theme$ | async) === 'dark' ? '☀' : '☾' }}
          </button>
          <button class="nav__burger" [class.is-open]="menuOpen()"
                  (click)="menuOpen.set(!menuOpen())"
                  [attr.aria-expanded]="menuOpen()"
                  [attr.aria-label]="(menuOpen() ? 'nav.closeMenu' : 'nav.menu') | translate">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .nav {
      position: fixed;
      inset: 0 0 auto;
      z-index: 100;
      transition: background var(--transition), box-shadow var(--transition);
    }
    .nav--solid {
      background: color-mix(in srgb, var(--bg) 82%, transparent);
      backdrop-filter: blur(14px);
      box-shadow: 0 1px 0 var(--line);
    }
    .nav__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 68px;
      gap: 1rem;
    }
    .nav__logo {
      font: 700 1.05rem var(--font-mono);
      color: var(--text-strong);
    }
    .nav__prompt { color: var(--cyan); }
    .nav__links {
      display: flex;
      gap: 1.6rem;
    }
    .nav__links a {
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      transition: color var(--transition);
    }
    .nav__links a:hover { color: var(--text-strong); }
    .nav__links a.active { color: var(--cyan); }
    .nav__actions { display: flex; align-items: center; gap: 0.5rem; }
    .nav__icon-btn {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 10px;
      color: var(--text-strong);
      font: 600 0.85rem var(--font-mono);
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: border-color var(--transition);
    }
    .nav__icon-btn:hover { border-color: var(--cyan); }
    .nav__burger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 40px;
      height: 40px;
      background: none;
      border: 0;
      cursor: pointer;
    }
    .nav__burger span {
      height: 2px;
      background: var(--text-strong);
      border-radius: 2px;
      transition: transform var(--transition), opacity var(--transition);
    }
    .nav__burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav__burger.is-open span:nth-child(2) { opacity: 0; }
    .nav__burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    @media (max-width: 860px) {
      .nav__burger { display: flex; }
      .nav__links {
        position: fixed;
        top: 68px;
        inset-inline: 0;
        flex-direction: column;
        padding: 1.5rem;
        gap: 1.2rem;
        background: var(--bg);
        border-bottom: 1px solid var(--line);
        transform: translateY(-120%);
        transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .nav__links--open { transform: none; }
    }
  `]
})
export class NavbarComponent {
  readonly theme = inject(ThemeService);
  readonly lang = inject(LanguageService);
  readonly theme$ = inject(Store).select(selectTheme);

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  readonly links = [
    { path: '/', key: 'nav.home' },
    { path: '/about', key: 'nav.about' },
    { path: '/skills', key: 'nav.skills' },
    { path: '/experience', key: 'nav.experience' },
    { path: '/projects', key: 'nav.projects' },
    { path: '/contact', key: 'nav.contact' }
  ];

  switchLang(): void {
    this.lang.set(this.lang.current() === 'en' ? 'de' : 'en');
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }
}
