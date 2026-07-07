import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Theme, UiActions, selectTheme } from '../../store/ui.state';

const STORAGE_KEY = 'portfolio.theme';

/**
 * Theme = single source of truth in the NgRx store; this service handles the
 * side effects: persistence, system-preference detection, DOM attribute.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly store = inject(Store);
  private readonly document = inject(DOCUMENT);

  init(): void {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    const initial: Theme = stored ?? (systemDark.matches ? 'dark' : 'light');
    this.store.dispatch(UiActions.setTheme({ theme: initial }));

    // Follow system changes only while the user hasn't chosen explicitly.
    systemDark.addEventListener('change', e => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        this.store.dispatch(UiActions.setTheme({ theme: e.matches ? 'dark' : 'light' }));
      }
    });

    this.store.select(selectTheme).subscribe(theme => {
      this.document.documentElement.setAttribute('data-theme', theme);
    });
  }

  toggle(): void {
    this.store.dispatch(UiActions.toggleTheme({}));
    this.store.select(selectTheme).subscribe(theme =>
      localStorage.setItem(STORAGE_KEY, theme)
    ).unsubscribe();
  }
}
