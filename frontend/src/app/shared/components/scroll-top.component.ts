import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  template: `
    @if (visible()) {
      <button class="to-top glass" (click)="scrollTop()" aria-label="Scroll back to top">↑</button>
    }
  `,
  styles: [`
    .to-top {
      position: fixed;
      right: 1.4rem;
      bottom: 1.4rem;
      z-index: 90;
      width: 46px;
      height: 46px;
      font-size: 1.1rem;
      color: var(--text-strong);
      cursor: pointer;
      transition: transform var(--transition);
    }
    .to-top:hover { transform: translateY(-3px); }
  `]
})
export class ScrollTopComponent {
  readonly visible = signal(false);

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible.set(window.scrollY > 600);
  }
}
