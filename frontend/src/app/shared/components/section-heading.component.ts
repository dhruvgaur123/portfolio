import { Component, Input } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';

/** Shared heading: mono eyebrow styled as a shell comment + display title. */
@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [RevealDirective],
  template: `
    <div class="heading" appReveal>
      <span class="mono-label"># {{ eyebrow }}</span>
      <h2>{{ title }}</h2>
      @if (subtitle) { <p class="heading__sub">{{ subtitle }}</p> }
    </div>
  `,
  styles: [`
    .heading { margin-bottom: 2.8rem; }
    .heading__sub { color: var(--text-muted); max-width: 52ch; }
  `]
})
export class SectionHeadingComponent {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) title = '';
  @Input() subtitle?: string;
}
