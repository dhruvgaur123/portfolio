import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <section class="section container nf">
      <pre class="nf__code glass" aria-hidden="true">$ GET {{ path }}
HTTP/1.1 404 Not Found</pre>
      <h1>{{ 'notFound.title' | translate }}</h1>
      <p>{{ 'notFound.text' | translate }}</p>
      <a routerLink="/" class="btn btn--primary">{{ 'notFound.home' | translate }}</a>
    </section>
  `,
  styles: [`
    .nf {
      min-height: 80vh;
      display: grid;
      place-content: center;
      text-align: center;
      gap: 0.6rem;
      padding-top: 68px;
    }
    .nf__code {
      padding: 1.2rem 1.6rem;
      text-align: left;
      color: var(--error);
      font-size: 0.9rem;
      justify-self: center;
    }
    .nf p { color: var(--text-muted); }
    .nf a { justify-self: center; }
  `]
})
export class NotFoundComponent {
  readonly path = location.pathname;
}
