import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  set(pageTitle: string, description?: string): void {
    const full = `${pageTitle} · Dhruv Gaur`;
    this.title.setTitle(full);
    this.meta.updateTag({ property: 'og:title', content: full });
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
  }
}
