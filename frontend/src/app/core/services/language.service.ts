import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Language, UiActions, selectLanguage } from '../../store/ui.state';

const STORAGE_KEY = 'portfolio.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly store = inject(Store);
  private readonly translate = inject(TranslateService);

  init(): void {
    this.translate.addLangs(['en', 'de']);
    this.translate.setDefaultLang('en');
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    const browser = this.translate.getBrowserLang() === 'de' ? 'de' : 'en';
    this.set(stored ?? browser, false);

    this.store.select(selectLanguage).subscribe(lang => {
      this.translate.use(lang);
      document.documentElement.lang = lang;
    });
  }

  set(language: Language, persist = true): void {
    this.store.dispatch(UiActions.setLanguage({ language }));
    if (persist) localStorage.setItem(STORAGE_KEY, language);
  }

  current(): Language {
    return (this.translate.currentLang as Language) ?? 'en';
  }
}
