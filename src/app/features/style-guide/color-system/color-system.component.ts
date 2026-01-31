import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/services/token.service';
import { ColorToken, ColorCategory } from '../../../core/models';

/**
 * Color System Component - Displays the color palette with tokens and usage rules
 */
@Component({
  selector: 'app-color-system',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="color-system">
      <header class="color-system__header">
        <div>
          <h1 class="vdc-heading-1">Color System</h1>
          <p class="vdc-caption">VDC color palette with token names and usage guidelines</p>
        </div>
      </header>

      <div class="color-system__chip-filter">
        @for (category of categoryOptions(); track category) {
          <button 
            class="filter-chip"
            [class.filter-chip--active]="selectedCategory() === category"
            (click)="onChipSelect(category)">
            {{ category }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="color-system__loading">
          @for (i of [1,2,3,4]; track i) {
            <div class="vdc-skeleton" style="height: 100px;"></div>
          }
        </div>
      }

      @if (!loading()) {
        <!-- Colors Grid -->
        <div class="color-system__grid">
          @for (color of filteredColors(); track color.token) {
            <div class="color-swatch">
              <div 
                class="color-swatch__preview"
                [style.background-color]="color.hex">
                <span class="color-swatch__hex">{{ color.hex }}</span>
              </div>
              <div class="color-swatch__info">
                <code class="color-swatch__token">--{{ color.token }}</code>
                <p class="color-swatch__usage">{{ color.usage }}</p>
                <span class="color-swatch__category">{{ color.category }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .color-system {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .color-system__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: var(--vdc-space-md);

      h1 {
        margin: 0 0 var(--vdc-space-xs);
      }
      p {
        margin: 0;
      }
    }

    .color-system__chip-filter {
      display: flex;
      flex-wrap: wrap;
      gap: var(--vdc-space-xs);
    }

    .filter-chip {
      padding: 6px 12px;
      border: 1px solid var(--vdc-border-default);
      border-radius: var(--vdc-radius-full);
      background: var(--vdc-surface-100);
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-sm);
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: var(--vdc-surface-200);
        color: var(--vdc-text-primary);
      }

      &--active {
        background: var(--vdc-primary);
        border-color: var(--vdc-primary);
        color: white;
      }
    }

    .color-system__loading {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--vdc-space-md);
    }

    .color-system__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--vdc-space-md);
    }

    .color-swatch {
      background-color: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      overflow: hidden;
      box-shadow: var(--vdc-shadow-sm);
    }

    .color-swatch__preview {
      height: 80px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: var(--vdc-space-sm);
    }

    .color-swatch__hex {
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 2px 8px;
      border-radius: var(--vdc-radius-sm);
      font-family: monospace;
      font-size: var(--vdc-font-size-sm);
    }

    .color-swatch__info {
      padding: var(--vdc-space-md);
    }

    .color-swatch__token {
      display: block;
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-primary);
      margin-bottom: var(--vdc-space-xs);
    }

    .color-swatch__usage {
      margin: 0 0 var(--vdc-space-sm);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
      line-height: var(--vdc-line-height-normal);
    }

    .color-swatch__category {
      display: inline-block;
      padding: 2px 8px;
      background-color: var(--vdc-surface-300);
      border-radius: var(--vdc-radius-full);
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
    }
  `]
})
export class ColorSystemComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  
  readonly loading = this.tokenService.loading;
  readonly colors = this.tokenService.colors;
  readonly categories = this.tokenService.colorCategories;
  
  readonly selectedCategory = signal<string>('All');
  
  readonly categoryOptions = computed(() => {
    const cats = this.categories().map(c => c.name);
    return ['All', ...cats];
  });
  
  readonly filteredColors = computed(() => {
    const selected = this.selectedCategory();
    if (selected === 'All') {
      return this.colors();
    }
    return this.colors().filter(c => c.category === selected);
  });
  
  ngOnInit(): void {
    this.tokenService.loadColors().subscribe();
  }
  
  onChipSelect(category: string): void {
    this.selectedCategory.set(category);
  }
}
