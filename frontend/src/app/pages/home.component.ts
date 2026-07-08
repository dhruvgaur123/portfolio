import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RevealDirective } from '../core/directives/reveal.directive';
import { PortfolioApiService } from '../core/services/portfolio-api.service';
import { SeoService } from '../core/services/seo.service';

/**
 * Signature element of the whole site: the hero is a live terminal session.
 * The intro "types itself" like a shell — a portfolio for a developer should
 * open in the developer's native habitat.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslateModule, AsyncPipe, DecimalPipe, RevealDirective],
  template: `
    <section class="hero">
      <div class="hero__aurora" aria-hidden="true"></div>
      <div class="hero__grid" aria-hidden="true"></div>

      <div class="container hero__inner">
        <div class="hero__copy">
          <span class="mono-label">{{ 'hero.years' | translate }}</span>
          <h1>
            {{ 'hero.greeting' | translate }}
            <span class="gradient-text">Dhruv Gaur</span>
          </h1>
          <p class="hero__role">{{ 'hero.role' | translate }}</p>
          <p class="hero__intro">{{ 'hero.intro' | translate }}</p>

          <div class="hero__cta">
            <a routerLink="/projects" class="btn btn--primary">{{ 'hero.viewProjects' | translate }}</a>
            <a [href]="(api.profile$ | async)?.resumeUrl ?? '#'" class="btn btn--ghost" download>
              {{ 'hero.downloadResume' | translate }}
            </a>
            <a routerLink="/contact" class="btn btn--ghost">{{ 'hero.contactMe' | translate }}</a>
          </div>

          <div class="hero__social">
            <a href="https://github.com/dhruvgaur123" target="_blank" rel="noopener">GitHub</a>
            <span aria-hidden="true">·</span>
            <a href="https://linkedin.com/in/dhruv-gaur" target="_blank" rel="noopener">LinkedIn</a>
            <span aria-hidden="true">·</span>
            <a href="mailto:dhruvgaur1124@gmail.com">Email</a>
          </div>
        </div>

        <div class="terminal glass" role="img" [attr.aria-label]="'hero.intro' | translate">
          <div class="terminal__bar">
            <span class="dot dot--r"></span><span class="dot dot--y"></span><span class="dot dot--g"></span>
            <span class="terminal__title">{{ 'hero.terminalTitle' | translate }}</span>
          </div>
          <pre class="terminal__screen">{{ typed() }}<span class="terminal__cursor">▌</span></pre>
        </div>
      </div>

      <a href="#stats" class="hero__scroll" [attr.aria-label]="'hero.scroll' | translate">
        <span class="hero__mouse"><span></span></span>
        {{ 'hero.scroll' | translate }}
      </a>
    </section>

    <section id="stats" class="section">
      <div class="container stats" appReveal>
        @if (api.profile$ | async; as profile) {
          @for (stat of statKeys; track stat.key; let i = $index) {
            <div class="stats__item glass" appReveal [revealDelay]="i * 100">
              <span class="stats__value gradient-text">{{ counted()[stat.key] | number }}+</span>
              <span class="stats__label">{{ 'stats.' + stat.key | translate }}</span>
            </div>
          }
        } @else {
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="stats__item skeleton" style="height: 110px"></div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding-top: 68px;
    }
    .hero__aurora {
      position: absolute;
      inset: -20%;
      background:
        radial-gradient(38% 45% at 22% 28%, color-mix(in srgb, var(--blue) 32%, transparent), transparent 70%),
        radial-gradient(32% 40% at 78% 30%, color-mix(in srgb, var(--purple) 26%, transparent), transparent 70%),
        radial-gradient(30% 38% at 60% 78%, color-mix(in srgb, var(--cyan) 22%, transparent), transparent 70%);
      filter: blur(40px);
      animation: drift 18s ease-in-out infinite alternate;
    }
    @keyframes drift {
      to { transform: translate3d(3%, -3%, 0) scale(1.06); }
    }
    .hero__grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(var(--line) 1px, transparent 1px),
        linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: radial-gradient(70% 60% at 50% 40%, #000 30%, transparent 100%);
      opacity: 0.5;
    }
    .hero__inner {
      position: relative;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      align-items: center;
      gap: 3rem;
    }
    .hero__role { font-size: 1.25rem; color: var(--text-strong); font-weight: 600; margin-top: -0.4rem; }
    .hero__intro { color: var(--text-muted); max-width: 46ch; }
    .hero__cta { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.6rem; }
    .hero__social {
      display: flex;
      gap: 0.7rem;
      margin-top: 1.8rem;
      font: 500 0.9rem var(--font-mono);
      color: var(--text-muted);
    }

    /* Terminal — doubles as the "professional photo" slot: swap for an <img> if preferred */
    .terminal { overflow: hidden; box-shadow: var(--shadow); }
    .terminal__bar {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.7rem 1rem;
      border-bottom: 1px solid var(--glass-border);
    }
    .dot { width: 11px; height: 11px; border-radius: 50%; }
    .dot--r { background: var(--error); }
    .dot--y { background: var(--warning); }
    .dot--g { background: var(--success); }
    .terminal__title { margin-left: 0.6rem; font: 500 0.78rem var(--font-mono); color: var(--text-muted); }
    .terminal__screen {
      margin: 0;
      padding: 1.2rem;
      min-height: 260px;
      background: var(--terminal-bg);
      color: #a5f3fc;
      font-size: 0.85rem;
      line-height: 1.8;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .terminal__cursor { animation: blink 1s step-end infinite; color: var(--cyan); }
    @keyframes blink { 50% { opacity: 0; } }

    .hero__scroll {
      position: absolute;
      bottom: 1.6rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      font: 500 0.75rem var(--font-mono);
    }
    .hero__mouse {
      width: 22px;
      height: 34px;
      border: 2px solid var(--text-muted);
      border-radius: 999px;
      display: flex;
      justify-content: center;
      padding-top: 6px;
    }
    .hero__mouse span {
      width: 3px;
      height: 7px;
      border-radius: 3px;
      background: var(--cyan);
      animation: wheel 1.6s ease-in-out infinite;
    }
    @keyframes wheel { 50% { transform: translateY(8px); opacity: 0.3; } }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.2rem;
    }
    .stats__item {
      padding: 1.6rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .stats__value { font: 800 2rem var(--font-mono); }
    .stats__label { color: var(--text-muted); font-size: 0.9rem; }

    @media (max-width: 960px) {
      .hero__inner { grid-template-columns: 1fr; }
      .stats { grid-template-columns: repeat(2, 1fr); }
      .hero__scroll { display: none; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);

  readonly typed = signal('');
  readonly counted = signal<Record<string, number>>({ years: 0, projects: 0, commits: 0, coffees: 0 });
  readonly statKeys = [
    { key: 'years' }, { key: 'projects' }, { key: 'commits' }, { key: 'coffees' }
  ] as const;

  private timers: ReturnType<typeof setTimeout>[] = [];

  private readonly script =
    '$ whoami\ndhruv-gaur — senior full stack developer\n\n' +
    '$ cat stack.txt\nangular · typescript · java 21 · spring boot 3\npostgresql · docker · kubernetes · aws\n\n' +
    '$ uptime --career\n8 years in production, 0 fear of legacy code\n\n' +
    '$ ./lets-build-something.sh';

  ngOnInit(): void {
    this.seo.set('Home', 'Senior Full Stack Developer — Angular, Spring Boot, Cloud. 8+ years of experience.');
    this.typeScript();
    this.animateCounters();
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
  }

  private typeScript(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.typed.set(this.script);
      return;
    }
    let i = 0;
    const tick = () => {
      if (i > this.script.length) return;
      this.typed.set(this.script.slice(0, i++));
      this.timers.push(setTimeout(tick, this.script[i - 1] === '\n' ? 90 : 22));
    };
    tick();
  }

  private animateCounters(): void {
    this.api.profile$.subscribe(profile => {
      const duration = 1400;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        this.counted.set({
          years: Math.round(profile.stats.years * ease),
          projects: Math.round(profile.stats.projects * ease),
          commits: Math.round(profile.stats.commits * ease),
          coffees: Math.round(profile.stats.coffees * ease)
        });
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
}
