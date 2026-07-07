import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';
import { uiFeature } from './store/ui.state';

export function translateLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })
    ),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideStore({ [uiFeature.name]: uiFeature.reducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useFactory: translateLoaderFactory, deps: [HttpClient] }
      })
    ),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ThemeService, LanguageService],
      useFactory: (theme: ThemeService, lang: LanguageService) => () => {
        theme.init();
        lang.init();
      }
    }
  ]
};
