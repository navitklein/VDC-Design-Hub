import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputsModule } from '@progress/kendo-angular-inputs';

interface VdcComponent {
  name: string;
  slug: string;
  description: string;
  kendoBase: string;
  status: 'draft' | 'review' | 'ready';
  category: string;
}

interface ComponentsFile {
  components: VdcComponent[];
}

/**
 * Explorer List Component - Shows all VDC Library components
 */
@Component({
  selector: 'app-explorer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, InputsModule],
  template: `
    <div class="explorer-list">
      <header class="explorer-list__header">
        <div>
          <h1 class="vdc-heading-1">Component Library</h1>
          <p class="vdc-caption">VDC-approved Kendo UI component wrappers</p>
        </div>

        <kendo-textbox
          [value]="searchQuery()"
          (valueChange)="onSearchChange($event)"
          placeholder="Search components..."
          class="explorer-list__search">
          <ng-template kendoTextBoxPrefixTemplate>
            <i class="fa-solid fa-search"></i>
          </ng-template>
        </kendo-textbox>
      </header>

      @if (loading()) {
        <div class="explorer-list__loading">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="vdc-skeleton" style="height: 120px;"></div>
          }
        </div>
      }

      @if (!loading() && filteredComponents().length === 0) {
        <div class="vdc-empty-state">
          <i class="fa-solid fa-cubes vdc-empty-state__icon"></i>
          <h3 class="vdc-empty-state__title">No components found</h3>
          <p class="vdc-empty-state__description">
            Try adjusting your search
          </p>
        </div>
      }

      @if (!loading() && filteredComponents().length > 0) {
        <div class="explorer-list__grid">
          @for (component of filteredComponents(); track component.slug) {
            <a [routerLink]="[component.slug]" class="component-card vdc-card">
              <div class="component-card__icon">
                <i class="fa-solid fa-cube"></i>
              </div>
              <div class="component-card__content">
                <div class="component-card__header">
                  <h3 class="component-card__name">{{ component.name }}</h3>
                  <span class="vdc-badge" [ngClass]="'vdc-badge--' + component.status">
                    {{ component.status }}
                  </span>
                </div>
                <p class="component-card__description">{{ component.description }}</p>
                <div class="component-card__meta">
                  <span class="component-card__kendo">
                    <i class="fa-solid fa-code"></i>
                    {{ component.kendoBase }}
                  </span>
                  <span class="component-card__category">{{ component.category }}</span>
                </div>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .explorer-list {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .explorer-list__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: var(--vdc-space-md);

      h1 { margin: 0 0 var(--vdc-space-xs); }
      p { margin: 0; }
    }

    .explorer-list__search {
      width: 280px;
    }

    .explorer-list__loading,
    .explorer-list__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--vdc-space-md);
    }

    .component-card {
      display: flex;
      gap: var(--vdc-space-md);
      padding: var(--vdc-space-md);
      text-decoration: none;
      color: inherit;
      transition: transform 0.15s ease;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .component-card__icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-md);
      color: var(--vdc-primary);
      font-size: 20px;
      flex-shrink: 0;
    }

    .component-card__content {
      flex: 1;
      min-width: 0;
    }

    .component-card__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--vdc-space-sm);
      margin-bottom: var(--vdc-space-xs);
    }

    .component-card__name {
      margin: 0;
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
    }

    .component-card__description {
      margin: 0 0 var(--vdc-space-sm);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
      line-height: var(--vdc-line-height-normal);
    }

    .component-card__meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--vdc-space-sm);
    }

    .component-card__kendo {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
      background-color: var(--vdc-surface-200);
      padding: 2px 8px;
      border-radius: var(--vdc-radius-sm);

      i { font-size: 10px; }
    }

    .component-card__category {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-disabled);
    }
  `]
})
export class ExplorerListComponent implements OnInit {
  private readonly http = inject(HttpClient);
  
  readonly loading = signal(true);
  readonly components = signal<VdcComponent[]>([]);
  readonly searchQuery = signal('');
  
  readonly filteredComponents = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.components();
    
    return this.components().filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query)
    );
  });
  
  ngOnInit(): void {
    this.http.get<ComponentsFile>('/assets/data/components.json').subscribe({
      next: (data) => {
        this.components.set(data.components);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  
  onSearchChange(value: string): void {
    this.searchQuery.set(value || '');
  }
}
