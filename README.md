# Developer Portfolio — Angular · Spring Boot · Docker

A production-ready portfolio for a Senior Full Stack Developer: an Angular 19 SPA with a Spring Boot 3 (Java 21) API, shipped as Docker containers behind an Nginx reverse proxy with HTTPS.

```
┌────────────┐   443/80   ┌──────────────┐
│   Nginx    │──────────► │  frontend    │  Angular SPA (static, nginx)
│  reverse   │            └──────────────┘
│   proxy    │   /api     ┌──────────────┐
│ (TLS, rate │──────────► │  backend     │  Spring Boot REST API
│  limiting) │            └──────────────┘
└────────────┘                  │ (later)
                          ┌──────────────┐
                          │ PostgreSQL   │  planned seam, see below
                          └──────────────┘
```

## Repository layout

```
portfolio/
├── frontend/                  Angular 19, standalone components, Signals, NgRx, ngx-translate
│   ├── src/app/core/          services (theme, language, SEO, API) + reveal directive
│   ├── src/app/store/         NgRx feature store for UI state (theme, language, menu)
│   ├── src/app/shared/        navbar, footer, project/skill cards, section heading, scroll-top
│   ├── src/app/pages/         home, about, skills, experience, projects, project detail, contact, 404
│   ├── src/assets/i18n/       en.json / de.json — every visible string is translated
│   ├── Dockerfile             multi-stage: node build → nginx runtime
│   └── nginx.conf             SPA fallback + immutable asset caching
├── backend/                   Spring Boot 3, Java 21, Maven
│   ├── .../config/            SecurityConfig (CORS, headers, stateless), OpenAPI
│   ├── .../web/               PortfolioController (GET endpoints), ContactController (POST /api/contact)
│   ├── .../service/           mail sending, in-memory rate limiter, JSON data provider
│   ├── .../exception/         global exception handler (validation, 429, 500)
│   ├── src/main/resources/data/  profile / skills / experience / projects placeholder JSON
│   └── Dockerfile             multi-stage: maven build → JRE runtime, non-root user
├── docker/nginx/              reverse proxy config (TLS, security headers, /api rate limit)
├── docker-compose.yml         production stack (proxy + frontend + backend, health checks)
├── docker-compose.dev.yml     hot-reload dev stack
└── .env.example               all required environment variables — copy to .env
```

## Quick start

### Local development

```bash
# Backend (requires JDK 21 + Maven)
cd backend && mvn spring-boot:run

# Frontend (requires Node 22) — proxies /api to :8080
cd frontend && npm install && npm start
```

Or with Docker only: `docker compose -f docker-compose.dev.yml up`.

Swagger UI: `http://localhost:8080/api/docs` · Health: `/actuator/health`.

### Production deployment (any Linux VPS: Hetzner, DigitalOcean, AWS, Azure, Oracle, Render, Railway)

```bash
cp .env.example .env          # fill in SMTP credentials, recipient, allowed origins
# edit docker/nginx/conf.d/portfolio.conf: replace your-domain.com
docker compose up -d --build
```

Issue TLS certificates with certbot in webroot mode against the mounted `certbot-www` volume, then reload the proxy. All secrets come from environment variables — nothing is committed.

## API

| Endpoint | Method | Description |
|---|---|---|
| `/api/profile` | GET | Hero content, stats, social links |
| `/api/skills` | GET | Skill categories with levels and years |
| `/api/experience` | GET | Work history timeline |
| `/api/projects` | GET | Projects incl. case-study details |
| `/api/contact` | POST | Validated, rate-limited contact form → Spring Mail |

Contact protection layers: Bean Validation on all fields, per-IP sliding-window rate limiter (3 requests / 15 min, configurable), honeypot field silently dropping bots, Nginx-level request limiting, and a marked spot in `ContactController` for a reCAPTCHA/Turnstile token check.

## Adding PostgreSQL later

The backend was designed so the database is a drop-in:

1. Uncomment the JPA + PostgreSQL dependencies in `pom.xml` and the `db` service in `docker-compose.yml`.
2. Add `spring.datasource.*` to `application.yml` (values from env vars).
3. Replace `PortfolioDataService` (the single repository seam) with Spring Data repositories — controllers don't change.

## Frontend architecture notes

- **Standalone components + lazy routes** — every page is its own chunk (code splitting out of the box).
- **NgRx** holds cross-cutting UI state (theme, language, mobile menu); `ThemeService`/`LanguageService` handle side effects: persistence, system `prefers-color-scheme` detection, DOM attribute, `ngx-translate` switching.
- **Signals** drive local component state (search query, filters, typing effect, counters, form status).
- **i18n**: `ngx-translate` with `en`/`de` JSON, browser-language detection, persisted choice.
- **Theming**: CSS custom properties per `[data-theme]`, animated color transition, dark by default.
- **Motion**: an `appReveal` directive (IntersectionObserver) powers scroll reveals; typing terminal hero, animated counters, card tilt, hamburger morph. Everything respects `prefers-reduced-motion`.
- **Accessibility**: skip link, semantic landmarks, `aria-expanded`/`aria-live`/meter roles, visible focus states, WCAG-conscious contrast.
- **SEO**: per-route titles/descriptions via `SeoService`, Open Graph + Twitter cards, JSON-LD Person schema, sitemap.xml, robots.txt, PWA manifest.

### Design system

| Token | Value |
|---|---|
| Primary / Accent / Secondary | `#2563EB` / `#06B6D4` / `#7C3AED` |
| Backgrounds | dark `#0F172A`, light `#F8FAFC` |
| Status | success `#22C55E`, warning `#F59E0B`, error `#EF4444` |
| Type | Inter (UI), JetBrains Mono (code, labels, terminal) |
| Radii | 10 / 16 / 24 px · pill buttons |
| Signature | the hero is a live terminal session that types itself — the mono "shell" voice (`~/`, `# eyebrow` comments) recurs in the logo, section headings, project cards and the 404 page |

## Performance checklist (Lighthouse > 95 targets)

- Lazy-loaded routes, tree-shaken standalone components, strict budgets in `angular.json`
- Fonts preconnected with `display=swap`; immutable hashed asset caching; gzip at both nginx layers
- Skeleton shimmer while API data streams in; animations are transform/opacity only
- SSR-ready: no direct DOM access outside browser-safe hooks/services — add `@angular/ssr` when prerendering is desired