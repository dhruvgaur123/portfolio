import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RevealDirective } from '../core/directives/reveal.directive';
import { PortfolioApiService } from '../core/services/portfolio-api.service';
import { SeoService } from '../core/services/seo.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';

type SendState = 'idle' | 'sending' | 'success' | 'error' | 'rateLimited';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, RevealDirective, SectionHeadingComponent],
  template: `
    <section class="section container page-top">
      <app-section-heading
        [eyebrow]="'contact.eyebrow' | translate"
        [title]="'contact.title' | translate"
        [subtitle]="'contact.subtitle' | translate" />

      <div class="layout">
        <form class="glass form" [formGroup]="form" (ngSubmit)="submit()" appReveal>
          <div class="form__row">
            <div class="form__field">
              <label for="name">{{ 'contact.name' | translate }}</label>
              <input id="name" formControlName="name" autocomplete="name" [attr.aria-invalid]="invalid('name')" />
              @if (invalid('name')) { <span class="form__error" role="alert">{{ 'contact.required' | translate }}</span> }
            </div>
            <div class="form__field">
              <label for="email">{{ 'contact.email' | translate }}</label>
              <input id="email" type="email" formControlName="email" autocomplete="email" [attr.aria-invalid]="invalid('email')" />
              @if (invalid('email')) {
                <span class="form__error" role="alert">
                  {{ (form.controls.email.hasError('required') ? 'contact.required' : 'contact.invalidEmail') | translate }}
                </span>
              }
            </div>
          </div>

          <div class="form__field">
            <label for="subject">{{ 'contact.subject' | translate }}</label>
            <input id="subject" formControlName="subject" [attr.aria-invalid]="invalid('subject')" />
            @if (invalid('subject')) { <span class="form__error" role="alert">{{ 'contact.required' | translate }}</span> }
          </div>

          <div class="form__field">
            <label for="message">{{ 'contact.message' | translate }}</label>
            <textarea id="message" rows="6" formControlName="message" [attr.aria-invalid]="invalid('message')"></textarea>
            @if (invalid('message')) {
              <span class="form__error" role="alert">
                {{ (form.controls.message.hasError('required') ? 'contact.required' : 'contact.minMessage') | translate }}
              </span>
            }
          </div>

          <!-- Honeypot: hidden from humans, bots fill it and get silently dropped -->
          <input class="hp" formControlName="website" tabindex="-1" autocomplete="off" aria-hidden="true" />

          <button class="btn btn--primary form__submit" type="submit" [disabled]="state() === 'sending'">
            @if (state() === 'sending') { <span class="spinner" aria-hidden="true"></span> }
            {{ (state() === 'sending' ? 'contact.sending' : 'contact.send') | translate }}
          </button>

          <div aria-live="polite">
            @switch (state()) {
              @case ('success') { <p class="form__msg form__msg--ok">{{ 'contact.success' | translate }}</p> }
              @case ('error') { <p class="form__msg form__msg--err">{{ 'contact.error' | translate }}</p> }
              @case ('rateLimited') { <p class="form__msg form__msg--err">{{ 'contact.rateLimited' | translate }}</p> }
            }
          </div>
        </form>

        <aside class="side">
          <div class="glass panel" appReveal [revealDelay]="120">
            <a href="mailto:dhruvgaur1124@gmail.com" class="side__mail mono-label">dhruvgaur1124&#64;gmail.com</a>
            <div class="side__social">
              <a href="https://github.com/dhruvgaur123" target="_blank" rel="noopener">GitHub</a>
              <a href="https://linkedin.com/in/dhruv-gaur" target="_blank" rel="noopener">LinkedIn</a>
            </div>
          </div>
          <div class="glass panel map" appReveal [revealDelay]="200">
            <span class="mono-label">INGOLSTADT, BAYERN, DE</span>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2631.068530611377!2d11.42456447732048!3d48.74238767131674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479eff1dcf8ff289%3A0x89603908912cfd6b!2sAm%20Pulverl%2027%2C%2085051%20Ingolstadt!5e0!3m2!1sen!2sde!4v1783545105348!5m2!1sen!2sde" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .page-top { padding-top: calc(68px + var(--section-y)); }
    .layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
    .form { padding: 1.8rem; display: grid; gap: 1.1rem; }
    .form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
    .form__field { display: grid; gap: 0.35rem; }
    label { font-weight: 600; font-size: 0.9rem; color: var(--text-strong); }
    input, textarea {
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--text-strong);
      font: 500 0.95rem var(--font-sans);
      resize: vertical;
      transition: border-color var(--transition);
    }
    input:focus, textarea:focus { border-color: var(--cyan); outline: none; }
    input[aria-invalid='true'], textarea[aria-invalid='true'] { border-color: var(--error); }
    .form__error { color: var(--error); font-size: 0.8rem; }
    .hp { position: absolute; left: -9999px; height: 0; opacity: 0; }
    .form__captcha {
      border: 1px dashed var(--line);
      border-radius: 12px;
      padding: 0.9rem;
      color: var(--text-muted);
      text-align: center;
    }
    .form__submit { justify-self: start; }
    .form__submit:disabled { opacity: 0.7; cursor: wait; }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 700ms linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .form__msg { margin: 0; font-weight: 500; }
    .form__msg--ok { color: var(--success); }
    .form__msg--err { color: var(--error); }
    .side { display: grid; gap: 1.2rem; align-content: start; }
    .panel { padding: 1.4rem; }
    .side__mail { font-size: 1rem; display: block; margin-bottom: 0.8rem; }
    .side__social { display: flex; gap: 1rem; }
    .map { min-height: 220px; display: grid; place-content: center; text-align: center; color: var(--text-muted); border-style: dashed; }
    @media (max-width: 860px) {
      .layout, .form__row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PortfolioApiService);
  private readonly seo = inject(SeoService);

  readonly state = signal<SendState>('idle');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.maxLength(150)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
    website: [''] // honeypot
  });

  ngOnInit(): void {
    this.seo.set('Contact', 'Get in touch about roles, projects or the stack.');
  }

  invalid(field: 'name' | 'email' | 'subject' | 'message'): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.state.set('sending');
    this.api.sendContact(this.form.getRawValue()).subscribe({
      next: () => {
        this.state.set('success');
        this.form.reset();
      },
      error: err => this.state.set(err?.status === 429 ? 'rateLimited' : 'error')
    });
  }
}
