import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { KENDO_CHIPLIST } from '@progress/kendo-angular-buttons';
import { TokenService } from '../../../core/services/token.service';

/** Palette color (same for both themes - raw color scales) */
interface PaletteColor {
  token: string;
  hex: string;
  usage: string;
  category: string;
}

/** Palette option for filter chips */
interface PaletteOption {
  id: string;         // Original category name for filtering (e.g., "Palette: Neutral Gray")
  label: string;      // Display name (e.g., "Neutral Gray")
  color: string;      // Representative hex color for the chip
}

/**
 * Palettes Component - Shows only palette colors (Neutral Gray, Blue, etc.)
 */
@Component({
  selector: 'app-palettes',
  standalone: true,
  imports: [CommonModule, FormsModule, KENDO_TEXTBOX, KENDO_CHIPLIST],
  template: `
    <div class="palettes">
      <header class="palettes__header">
        <h1 class="vdc-heading-1">Palettes</h1>
        <p class="vdc-caption">Raw color scales from Kendo UI Fluent theme</p>
      </header>

      <div class="palettes__filters">
        <!-- Search -->
        <kendo-textbox
          class="palettes__search"
          placeholder="Search by token, hex value..."
          [value]="searchQuery()"
          (valueChange)="onSearch($event)"
          [clearButton]="true"
          [size]="'large'">
          <ng-template kendoTextBoxPrefixTemplate>
            <i class="fa-regular fa-search"></i>
          </ng-template>
        </kendo-textbox>

        <!-- Palette Filter Chips -->
        <div class="palettes__chips">
          <button
            class="palette-chip"
            [class.palette-chip--selected]="selectedPalette() === 'All'"
            (click)="onPaletteSelect('All')">
            All
          </button>
          @for (palette of paletteOptions(); track palette.id) {
            <button
              class="palette-chip"
              [class.palette-chip--selected]="selectedPalette() === palette.id"
              [style.--chip-color]="palette.color"
              (click)="onPaletteSelect(palette.id)">
              <span class="palette-chip__dot" [style.background-color]="palette.color"></span>
              {{ palette.label }}
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="palettes__loading">
          @for (i of [1,2,3,4]; track i) {
            <div class="vdc-skeleton" style="height: 100px;"></div>
          }
        </div>
      }

      @if (!loading()) {
        @if (filteredColors().length === 0) {
          <div class="palettes__empty">
            <i class="fa-regular fa-search"></i>
            <p>No colors found</p>
          </div>
        } @else {
          <div class="palettes__grid">
            @for (color of filteredColors(); track color.token) {
              <div class="color-swatch">
                <div 
                  class="color-swatch__preview"
                  [style.background-color]="color.hex">
                  <button class="color-swatch__copy" (click)="copyToClipboard(color.hex)" title="Copy hex">
                    <span class="color-swatch__hex">{{ color.hex }}</span>
                    <i class="fa-regular fa-copy"></i>
                  </button>
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
    .palettes {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .palettes__header {
      h1 { margin: 0 0 var(--vdc-space-xs); }
      p { margin: 0; }
    }

    .palettes__filters {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-md);
    }

    .palettes__search {
      max-width: 400px;
    }

    .palettes__chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--vdc-space-sm);
    }

    .palette-chip {
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

        .palette-chip__dot {
          border-color: white;
          box-shadow: 0 0 0 1px white;
        }
      }
    }

    .palette-chip__dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid var(--vdc-border-subtle);
      flex-shrink: 0;
    }

    .palettes__loading,
    .palettes__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--vdc-space-md);
    }

    .palettes__empty {
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

    .color-swatch__preview {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 80px;
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
export class PalettesComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  
  readonly loading = this.tokenService.loading;
  readonly colors = this.tokenService.colors;
  readonly categories = this.tokenService.colorCategories;
  
  readonly searchQuery = signal<string>('');
  readonly selectedPalette = signal<string>('All');

  // Build palette options with display names and representative colors
  readonly paletteOptions = computed((): PaletteOption[] => {
    const paletteCategories = this.categories()
      .filter(c => c.name.startsWith('Palette:'));
    
    const colors = this.colors();
    
    return paletteCategories.map(cat => {
      // Get colors for this palette
      const paletteColors = colors.filter(c => c.category === cat.name);
      
      // Find a mid-tone color (around index 7-8) for the chip
      const midIndex = Math.floor(paletteColors.length / 2);
      const representativeColor = paletteColors[midIndex]?.hex || '#808080';
      
      return {
        id: cat.name,
        label: cat.name.replace('Palette: ', ''),
        color: representativeColor
      };
    });
  });

  // Palette colors (same for both themes - raw color scales)
  readonly paletteColors = computed((): PaletteColor[] => {
    // Only include palette colors - use light theme as source (same as dark for palettes)
    return this.colors()
      .filter(c => c.category.startsWith('Palette:'))
      .map(color => ({
        token: color.token,
        hex: color.hex,
        usage: color.usage,
        category: color.category
      }));
  });

  readonly filteredColors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const selected = this.selectedPalette();
    let colors = this.paletteColors();
    
    if (selected !== 'All') {
      colors = colors.filter(c => c.category === selected);
    }
    
    if (query) {
      colors = colors.filter(c => 
        c.token.toLowerCase().includes(query) ||
        c.hex.toLowerCase().includes(query) ||
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

  onPaletteSelect(paletteId: string): void {
    this.selectedPalette.set(paletteId);
  }

  /** Get display category without prefix */
  getDisplayCategory(category: string): string {
    return category.replace('Palette: ', '');
  }

  /** Copy hex value to clipboard */
  copyToClipboard(hex: string): void {
    navigator.clipboard.writeText(hex);
  }
}
