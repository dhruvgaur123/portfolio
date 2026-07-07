import { createActionGroup, createFeature, createReducer, on, props } from '@ngrx/store';

export type Theme = 'dark' | 'light';
export type Language = 'en' | 'de';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Set Theme': props<{ theme: Theme }>(),
    'Toggle Theme': props<Record<string, never>>(),
    'Set Language': props<{ language: Language }>(),
    'Toggle Mobile Menu': props<{ open: boolean }>()
  }
});

export interface UiState {
  theme: Theme;
  language: Language;
  mobileMenuOpen: boolean;
}

const initialState: UiState = { theme: 'dark', language: 'en', mobileMenuOpen: false };

export const uiFeature = createFeature({
  name: 'ui',
  reducer: createReducer(
    initialState,
    on(UiActions.setTheme, (state, { theme }) => ({ ...state, theme })),
    on(UiActions.toggleTheme, state => ({ ...state, theme: state.theme === 'dark' ? 'light' as const : 'dark' as const })),
    on(UiActions.setLanguage, (state, { language }) => ({ ...state, language })),
    on(UiActions.toggleMobileMenu, (state, { open }) => ({ ...state, mobileMenuOpen: open }))
  )
});

export const { selectTheme, selectLanguage, selectMobileMenuOpen } = uiFeature;
