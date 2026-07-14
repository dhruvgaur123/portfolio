import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

interface DiagramNode {
  title: string;
  subtitle: string;
  host: string;
}

interface DiagramSpec {
  nodes: [DiagramNode, DiagramNode, DiagramNode];
  forwardLabel: string;
  backLabel: string;
  dbLabel: string;
}

const DIAGRAMS: Record<string, DiagramSpec> = {
  'ecommerce-platform': {
    nodes: [
      { title: 'Angular 19', subtitle: 'Storefront + Admin', host: 'Vercel' },
      { title: 'Quarkus API', subtitle: 'JAX-RS → Service → Panache', host: 'Render' },
      { title: 'PostgreSQL 16', subtitle: 'Flyway migrations', host: 'Neon / Supabase' }
    ],
    forwardLabel: 'REST + JWT',
    backLabel: 'JSON',
    dbLabel: 'JDBC'
  },
  'finance-manager': {
    nodes: [
      { title: 'Next.js 15', subtitle: 'App Router · TanStack Query', host: 'Vercel' },
      { title: 'Quarkus API', subtitle: 'Panache · JWT · Scheduler · Mailer', host: 'Render' },
      { title: 'PostgreSQL', subtitle: 'Flyway migrations', host: 'Neon / Supabase' }
    ],
    forwardLabel: 'REST + JWT',
    backLabel: 'JSON',
    dbLabel: 'JDBC'
  }
};

@Component({
  selector: 'app-architecture-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (spec(); as s) {
      <svg viewBox="0 0 900 240" class="diagram-svg" role="img" [attr.aria-label]="'Architecture: ' + s.nodes[0].title + ' to ' + s.nodes[1].title + ' to ' + s.nodes[2].title">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--cyan)" />
          </marker>
        </defs>

        <!-- hosting boundaries -->
        <rect x="14" y="34" width="248" height="172" rx="14" class="host-box" />
        <text x="138" y="24" class="host-label">{{ s.nodes[0].host }}</text>

        <rect x="326" y="34" width="248" height="172" rx="14" class="host-box" />
        <text x="450" y="24" class="host-label">{{ s.nodes[1].host }}</text>

        <rect x="638" y="34" width="248" height="172" rx="14" class="host-box" />
        <text x="762" y="24" class="host-label">{{ s.nodes[2].host }}</text>

        <!-- nodes -->
        @for (n of s.nodes; track n.title; let i = $index) {
          <g [attr.transform]="'translate(' + (38 + i * 312) + ',70)'">
            <rect width="200" height="100" rx="12" class="node-box" />
            <text x="100" y="42" text-anchor="middle" class="node-title">{{ n.title }}</text>
            <text x="100" y="66" text-anchor="middle" class="node-subtitle">{{ n.subtitle }}</text>
          </g>
        }

        <!-- arrows: node1 <-> node2 -->
        <line x1="238" y1="108" x2="322" y2="108" class="arrow-line" marker-end="url(#arrow)" />
        <text x="280" y="98" text-anchor="middle" class="arrow-label">{{ s.forwardLabel }}</text>

        <line x1="322" y1="140" x2="238" y2="140" class="arrow-line" marker-end="url(#arrow)" />
        <text x="280" y="158" text-anchor="middle" class="arrow-label">{{ s.backLabel }}</text>

        <!-- arrow: node2 -> node3 -->
        <line x1="550" y1="120" x2="634" y2="120" class="arrow-line" marker-end="url(#arrow)" />
        <text x="592" y="110" text-anchor="middle" class="arrow-label">{{ s.dbLabel }}</text>
      </svg>
    }
  `,
  styles: [`
    :host { display: block; }
    .diagram-svg { width: 100%; height: auto; overflow: visible; }
    .host-box {
      fill: none;
      stroke: var(--line);
      stroke-dasharray: 4 5;
    }
    .host-label {
      text-anchor: middle;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.06em;
      fill: var(--text-muted);
      text-transform: uppercase;
    }
    .node-box {
      fill: var(--surface);
      stroke: var(--glass-border);
    }
    .node-title {
      font-family: var(--font-sans);
      font-weight: 700;
      font-size: 15px;
      fill: var(--text-strong);
    }
    .node-subtitle {
      font-family: var(--font-mono);
      font-size: 10.5px;
      fill: var(--text-muted);
    }
    .arrow-line {
      stroke: var(--cyan);
      stroke-width: 1.5;
    }
    .arrow-label {
      font-family: var(--font-mono);
      font-size: 10.5px;
      fill: var(--cyan);
    }
  `]
})
export class ArchitectureDiagramComponent {
  private readonly projectId = signal('');

  @Input({ required: true }) set id(value: string) {
    this.projectId.set(value);
  }

  readonly spec = computed<DiagramSpec | undefined>(() => DIAGRAMS[this.projectId()]);
}
