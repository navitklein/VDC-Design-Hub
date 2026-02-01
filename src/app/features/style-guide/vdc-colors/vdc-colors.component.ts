import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { KENDO_CHIPLIST } from '@progress/kendo-angular-buttons';
import { TokenService } from '../../../core/services/token.service';
import { ColorToken } from '../../../core/models';

/** Paired color with both light and dark hex values */
interface PairedColor {
  token: string;
  lightHex: string;
  darkHex: string | null;
  usage: string;
  category: string;
}

/** Category option for filter chips */
interface CategoryOption {
  id: string;         // Original category name for filtering (e.g., "VDC: Entity")
  label: string;      // Display name (e.g., "Entity")
  color: string;      // Representative hex color for the chip
}

/**
 * VDC Colors Component - Shows VDC-specific custom colors
 */
@Component({
  selector: 'app-vdc-colors',
  standalone: true,
  imports: [CommonModule, FormsModule, KENDO_TEXTBOX, KENDO_CHIPLIST],
  template: `
    <div class="vdc-colors">
      <header class="vdc-colors__header">
        <h1 class="vdc-heading-1">VDC Colors</h1>
        <p class="vdc-caption">VDC-specific custom colors for entities and navigation</p>
      </header>

      <div class="vdc-colors__filters">
        <!-- Search -->
        <kendo-textbox
          class="vdc-colors__search"
          placeholder="Search by token, hex value..."
          [value]="searchQuery()"
          (valueChange)="onSearch($event)"
          [clearButton]="true"
          [size]="'large'">
          <ng-template kendoTextBoxPrefixTemplate>
            <i class="fa-regular fa-search"></i>
          </ng-template>
        </kendo-textbox>

        <!-- Category Filter Chips -->
        <div class="vdc-colors__chips">
          <button
            class="category-chip"
            [class.category-chip--selected]="selectedCategory() === 'All'"
            (click)="onCategorySelect('All')">
            All
          </button>
          @for (category of categoryOptions(); track category.id) {
            <button
              class="category-chip"
              [class.category-chip--selected]="selectedCategory() === category.id"
              [style.--chip-color]="category.color"
              (click)="onCategorySelect(category.id)">
              <span class="category-chip__dot" [style.background-color]="category.color"></span>
              {{ category.label }}
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="vdc-colors__loading">
          @for (i of [1,2,3,4]; track i) {
            <div class="vdc-skeleton" style="height: 100px;"></div>
          }
        </div>
      }

      @if (!loading()) {
        @if (filteredColors().length === 0) {
          <div class="vdc-colors__empty">
            <i class="fa-regular fa-search"></i>
            <p>No colors found</p>
          </div>
        } @else {
          <div class="vdc-colors__grid">
            @for (color of filteredColors(); track color.token) {
              <div class="color-swatch">
                <div class="color-swatch__previews">
                  <div 
                    class="color-swatch__preview color-swatch__preview--light"
                    [style.background-color]="color.lightHex">
                    <button class="color-swatch__copy" (click)="copyToClipboard(color.lightHex)" title="Copy hex">
                      <span class="color-swatch__hex">{{ color.lightHex }}</span>
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                  @if (color.darkHex) {
                    <div 
                      class="color-swatch__preview color-swatch__preview--dark"
                      [style.background-color]="color.darkHex">
                      <button class="color-swatch__copy" (click)="copyToClipboard(color.darkHex)" title="Copy hex">
                        <span class="color-swatch__hex">{{ color.darkHex }}</span>
                        <i class="fa-regular fa-copy"></i>
                      </button>
                    </div>
                  }
                </div>
                <div class="color-swatch__info">
                  <code class="color-swatch__token">--{{ color.token }}</code>
                  <p class="color-swatch__usage">{{ color.usage }}</p>
                  <span class="color-swatch__category">{{ getDisplayCategory(color.category) }}</span>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .vdc-colors {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .vdc-colors__header {
      h1 { margin: 0 0 var(--vdc-space-xs); }
      p { margin: 0; }
    }

    .vdc-colors__filters {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-md);
    }

    .vdc-colors__search {
      max-width: 400px;
    }

    .vdc-colors__chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--vdc-space-sm);
    }

    .category-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid var(--vdc-border-default);
      border-radius: var(--vdc-radius-full);
      background: var(--vdc-surface-100);
      color: var(--vdc-text-primary);
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-medium);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        border-color: var(--chip-color, var(--vdc-border-strong));
        background: color-mix(in srgb, var(--chip-color, var(--vdc-surface-200)) 10%, var(--vdc-surface-100));
      }

      &--selected {
        border-color: var(--chip-color, var(--vdc-primary));
        background: var(--chip-color, var(--vdc-primary));
        color: white;

        .category-chip__dot {
          border-color: white;
          box-shadow: 0 0 0 1px white;
        }
      }
    }

    .category-chip__dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid var(--vdc-border-subtle);
      flex-shrink: 0;
    }

    .vdc-colors__loading,
    .vdc-colors__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--vdc-space-md);
    }

    .vdc-colors__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--vdc-space-xl);
      color: var(--vdc-text-secondary);
      text-align: center;

      i { font-size: 48px; margin-bottom: var(--vdc-space-md); opacity: 0.3; }
      p { margin: 0; font-size: var(--vdc-font-size-md); }
    }

    .color-swatch {
      background-color: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      overflow: hidden;
      box-shadow: var(--vdc-shadow-sm);
    }

    .color-swatch__previews {
      display: flex;
      height: 80px;
    }

    .color-swatch__preview {
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: var(--vdc-space-sm);
    }

    .color-swatch__copy {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 4px 8px;
      border: none;
      border-radius: var(--vdc-radius-sm);
      cursor: pointer;
      transition: background-color 0.15s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }

      i {
        font-size: 10px;
        opacity: 0.7;
      }

      &:hover i {
        opacity: 1;
      }
    }

    .color-swatch__hex {
      font-family: monospace;
      font-size: 10px;
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
export class VdcColorsComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  
  readonly loading = this.tokenService.loading;
  readonly colors = this.tokenService.colors;
  readonly colorsDark = this.tokenService.colorsDark;
  readonly categories = this.tokenService.colorCategories;
  
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('All');

  // Build category options with display names and representative colors
  readonly categoryOptions = computed((): CategoryOption[] => {
    const vdcCategories = this.categories()
      .filter(c => c.name.startsWith('VDC:'));
    
    const colors = this.colors();
    
    return vdcCategories.map(cat => {
      // Get colors for this category
      const categoryColors = colors.filter(c => c.category === cat.name);
      
      // Find the first "main" color (without -light, -dark, -subtle suffixes)
      const mainColor = categoryColors.find(c => 
        !c.token.endsWith('-light') && 
        !c.token.endsWith('-dark') && 
        !c.token.endsWith('-subtle')
      );
      const representativeColor = mainColor?.hex || categoryColors[0]?.hex || '#808080';
      
      return {
        id: cat.name,
        label: cat.name.replace('VDC: ', ''),
        color: representativeColor
      };
    });
  });

  // Pair light and dark colors
  readonly pairedColors = computed((): PairedColor[] => {
    const lightColors = this.colors();
    const darkColors = this.colorsDark();
    
    const darkMap = new Map<string, ColorToken>();
    for (const color of darkColors) {
      darkMap.set(color.token, color);
    }
    
    // Only include VDC colors
    return lightColors
      .filter(c => c.category.startsWith('VDC:'))
      .map(light => ({
        token: light.token,
        lightHex: light.hex,
        darkHex: darkMap.get(light.token)?.hex || null,
        usage: light.usage,
        category: light.category
      }));
  });

  readonly filteredColors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const selected = this.selectedCategory();
    let colors = this.pairedColors();
    
    if (selected !== 'All') {
      colors = colors.filter(c => c.category === selected);
    }
    
    if (query) {
      colors = colors.filter(c => 
        c.token.toLowerCase().includes(query) ||
        c.lightHex.toLowerCase().includes(query) ||
        (c.darkHex && c.darkHex.toLowerCase().includes(query)) ||
        c.usage.toLowerCase().includes(query)
      );
    }
    
    return colors;
  });

  ngOnInit(): void {
    this.tokenService.loadColors().subscribe();
  }

  onSearch(query: string | null): void {
    this.searchQuery.set(query || '');
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  /** Get display category without prefix */
  getDisplayCategory(category: string): string {
    return category.replace('VDC: ', '');
  }

  /** Copy hex value to clipboard */
  copyToClipboard(hex: string): void {
    navigator.clipboard.writeText(hex);
  }
}
