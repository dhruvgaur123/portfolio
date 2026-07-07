import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer.component';
import { NavbarComponent } from './shared/components/navbar.component';
import { ScrollTopComponent } from './shared/components/scroll-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ScrollTopComponent],
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <app-navbar />
    <main id="main">
      <router-outlet />
    </main>
    <app-footer />
    <app-scroll-top />
  `,
  styles: [`
    .skip-link {
      position: absolute;
      left: -999px;
      top: 0;
      z-index: 200;
      padding: 0.6rem 1rem;
      background: var(--blue);
      color: #fff;
      border-radius: 0 0 8px 0;
    }
    .skip-link:focus { left: 0; }
    main { min-height: 70vh; }
  `]
})
export class AppComponent {}
