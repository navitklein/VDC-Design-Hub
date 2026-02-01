import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { KENDO_CHIPLIST } from '@progress/kendo-angular-buttons';
import { TokenService } from '../../../core/services/token.service';
import { ColorToken, ColorCategory } from '../../../core/models';

/** Paired color with both light and dark hex values */
interface PairedColor {
  token: string;
  lightHex: string;
  darkHex: string | null;
  usage: string;
  category: string;
}

/**
 * Color System Component - Displays the color palette with tokens and usage rules
 */
@Component({
  selector: 'app-color-system',
  standalone: true,
  imports: [CommonModule, FormsModule, TabStripModule, KENDO_TEXTBOX, KENDO_CHIPLIST],
  template: `
    <div class="color-system">
      <header class="color-system__header">
        <div>
          <h1 class="vdc-heading-1">Color System</h1>
          <p class="vdc-caption">Kendo UI Fluent theme colors with usage guidelines</p>
        </div>
      </header>

      <!-- Kendo TabStrip -->
      <kendo-tabstrip [animate]="true" [size]="'large'">
        <kendo-tabstrip-tab [title]="'Color Swatches'" [selected]="true">
          <ng-template kendoTabTitle>
            <i class="fa-regular fa-palette"></i> Color Swatches
          </ng-template>
          <ng-template kendoTabContent>
            <div class="color-system__filters">
              <!-- Kendo TextBox for Search -->
              <kendo-textbox
                class="color-system__search"
                placeholder="Search by token, hex value, usage..."
                [value]="searchQuery()"
                (valueChange)="onSearch($event)"
                [clearButton]="true"
                [size]="'large'">
                <ng-template kendoTextBoxPrefixTemplate>
                  <i class="fa-solid fa-search"></i>
                </ng-template>
              </kendo-textbox>

              <!-- Kendo ChipList for Category Filter -->
              <kendo-chiplist [selection]="'single'">
                @for (category of categoryOptions(); track category) {
                  <kendo-chip 
                    [label]="category"
                    [size]="'large'"
                    [rounded]="'full'"
                    [selected]="selectedCategory() === category"
                    (contentClick)="onChipClick(category)">
                  </kendo-chip>
                }
              </kendo-chiplist>
            </div>

        @if (loading()) {
          <div class="color-system__loading">
            @for (i of [1,2,3,4]; track i) {
              <div class="vdc-skeleton" style="height: 100px;"></div>
            }
          </div>
        }

        @if (!loading()) {
          @if (filteredPairedColors().length === 0) {
            <div class="color-system__empty">
              <i class="fa-solid fa-search"></i>
              <p>No colors found matching "{{ searchQuery() }}"</p>
            </div>
          } @else {
            <div class="color-system__grid">
              @for (color of filteredPairedColors(); track color.token) {
                <div class="color-swatch">
                  <div class="color-swatch__previews">
                    <div 
                      class="color-swatch__preview color-swatch__preview--light"
                      [style.background-color]="color.lightHex">
                      <span class="color-swatch__hex">{{ color.lightHex }}</span>
                    </div>
                    @if (color.darkHex) {
                      <div 
                        class="color-swatch__preview color-swatch__preview--dark"
                        [style.background-color]="color.darkHex">
                        <span class="color-swatch__hex">{{ color.darkHex }}</span>
                      </div>
                    }
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
        }
          </ng-template>
        </kendo-tabstrip-tab>

        <kendo-tabstrip-tab [title]="'Usage Guidelines'">
          <ng-template kendoTabTitle>
            <i class="fa-regular fa-books"></i> Usage Guidelines
          </ng-template>
          <ng-template kendoTabContent>
        <div class="guidelines">
          <!-- Surfaces Section -->
          <section class="guidelines__section">
            <h2 class="guidelines__title">
              <i class="fa-solid fa-layer-group"></i> Surface Colors
            </h2>
            <p class="guidelines__desc">Which surface token to use for each component type</p>
            
            <div class="guidelines__table-wrapper">
              <table class="guidelines__table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Light Theme</th>
                    <th>Dark Theme</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  @for (rule of surfaceRules(); track rule.component) {
                    <tr>
                      <td class="cell-component">{{ rule.component }}</td>
                      <td class="cell-token">
                        <span class="color-dot" [style.background-color]="getColorHex(rule.light, 'light')"></span>
                        <code>{{ rule.light }}</code>
                      </td>
                      <td class="cell-token">
                        <span class="color-dot color-dot--dark" [style.background-color]="getColorHex(rule.dark, 'dark')"></span>
                        <code>{{ rule.dark }}</code>
                      </td>
                      <td class="cell-notes">{{ rule.notes }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <!-- Text Colors Section -->
          <section class="guidelines__section">
            <h2 class="guidelines__title">
              <i class="fa-solid fa-font"></i> Text Colors
            </h2>
            <p class="guidelines__desc">Guidelines for choosing text colors</p>
            
            <div class="guidelines__table-wrapper">
              <table class="guidelines__table">
                <thead>
                  <tr>
                    <th>Use Case</th>
                    <th>Token (Light)</th>
                    <th>Token (Dark)</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  @for (rule of textRules(); track rule.use) {
                    <tr>
                      <td class="cell-component">{{ rule.use }}</td>
                      <td class="cell-token">
                        <span class="color-dot" [style.background-color]="getColorHex(rule.token, 'light')"></span>
                        <code>{{ rule.token }}</code>
                      </td>
                      <td class="cell-token">
                        <span class="color-dot color-dot--dark" [style.background-color]="getColorHex(rule.token, 'dark')"></span>
                        <code>{{ rule.token }}</code>
                      </td>
                      <td class="cell-notes">{{ rule.notes }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <!-- Border Colors Section -->
          <section class="guidelines__section">
            <h2 class="guidelines__title">
              <i class="fa-solid fa-border-all"></i> Border Colors
            </h2>
            <p class="guidelines__desc">Guidelines for border usage</p>
            
            <div class="guidelines__table-wrapper">
              <table class="guidelines__table">
                <thead>
                  <tr>
                    <th>Use Case</th>
                    <th>Token (Light)</th>
                    <th>Token (Dark)</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  @for (rule of borderRules(); track rule.use) {
                    <tr>
                      <td class="cell-component">{{ rule.use }}</td>
                      <td class="cell-token">
                        <span class="color-dot" [style.background-color]="getColorHex(rule.token, 'light')"></span>
                        <code>{{ rule.token }}</code>
                      </td>
                      <td class="cell-token">
                        <span class="color-dot color-dot--dark" [style.background-color]="getColorHex(rule.token, 'dark')"></span>
                        <code>{{ rule.token }}</code>
                      </td>
                      <td class="cell-notes">{{ rule.notes }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <!-- Interactive States Section -->
          <section class="guidelines__section">
            <h2 class="guidelines__title">
              <i class="fa-solid fa-hand-pointer"></i> Interactive States
            </h2>
            <p class="guidelines__desc">State patterns for interactive elements</p>
            
            <div class="guidelines__table-wrapper">
              <table class="guidelines__table">
                <thead>
                  <tr>
                    <th>State</th>
                    <th>Background</th>
                    <th>Text</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  @for (rule of stateRules(); track rule.state) {
                    <tr>
                      <td class="cell-component">{{ rule.state }}</td>
                      <td class="cell-token">
                        <span class="color-dot" [style.background-color]="getColorHex(rule.background, 'light')"></span>
                        <code>{{ rule.background }}</code>
                      </td>
                      <td class="cell-token">
                        <span class="color-dot" [style.background-color]="getColorHex(rule.text, 'light')"></span>
                        <code>{{ rule.text }}</code>
                      </td>
                      <td class="cell-notes">{{ rule.notes }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        </div>
          </ng-template>
        </kendo-tabstrip-tab>
      </kendo-tabstrip>
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

    /* Kendo TabStrip customization */
    kendo-tabstrip {
      margin-bottom: var(--vdc-space-md);
    }

    /* Filters wrapper for search and chips */
    .color-system__filters {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-md);
      margin-bottom: var(--vdc-space-md);
    }

    .color-system__search {
      max-width: 400px;
    }

    /* Add padding between icon and border */
    ::ng-deep .color-system__search .k-input-prefix {
      padding-left: var(--vdc-space-sm);
    }

    /* Kendo ChipList customization */
    kendo-chiplist {
      display: flex;
      flex-wrap: wrap;
      gap: var(--vdc-space-xs);
    }

    .color-system__loading {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--vdc-space-md);
    }

    .color-system__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--vdc-space-xl);
      color: var(--vdc-text-secondary);
      text-align: center;

      i {
        font-size: 48px;
        margin-bottom: var(--vdc-space-md);
        opacity: 0.3;
      }

      p {
        margin: 0;
        font-size: var(--vdc-font-size-md);
      }
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

    /* Side-by-side preview container */
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

    .color-swatch__preview--light {
      /* Light background context */
    }

    .color-swatch__preview--dark {
      /* Dark theme preview with dark surround */
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%);
        pointer-events: none;
      }
    }

    .color-swatch__hex {
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 2px 6px;
      border-radius: var(--vdc-radius-sm);
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

    /* Guidelines Styles */
    .guidelines {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-xl);
    }

    .guidelines__section {
      background: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      padding: var(--vdc-space-lg);
      box-shadow: var(--vdc-shadow-sm);
    }

    .guidelines__title {
      margin: 0 0 var(--vdc-space-xs);
      font-size: var(--vdc-font-size-lg);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);

      i {
        color: var(--vdc-primary);
      }
    }

    .guidelines__desc {
      margin: 0 0 var(--vdc-space-md);
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-sm);
    }

    .guidelines__table-wrapper {
      overflow-x: auto;
    }

    .guidelines__table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--vdc-font-size-sm);

      th, td {
        padding: var(--vdc-space-sm) var(--vdc-space-md);
        text-align: left;
        border-bottom: 1px solid var(--vdc-border-subtle);
      }

      th {
        background: var(--vdc-surface-200);
        font-weight: var(--vdc-font-weight-semibold);
        color: var(--vdc-text-primary);
        white-space: nowrap;
      }

      tbody tr:hover {
        background: var(--vdc-surface-200);
      }

      .cell-component {
        font-weight: var(--vdc-font-weight-medium);
        color: var(--vdc-text-primary);
        white-space: nowrap;
      }

      .cell-token {
        display: flex;
        align-items: center;
        gap: var(--vdc-space-xs);
      }

      .cell-token code {
        background: var(--vdc-surface-300);
        padding: 2px 6px;
        border-radius: var(--vdc-radius-sm);
        font-family: monospace;
        font-size: var(--vdc-font-size-xs);
        color: var(--vdc-primary);
      }

      .cell-notes {
        color: var(--vdc-text-secondary);
      }
    }

    /* Color dot for guidelines tables */
    .color-dot {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: var(--vdc-radius-sm);
      border: 1px solid var(--vdc-border-default);
      flex-shrink: 0;
    }

    .color-dot--dark {
      box-shadow: inset 0 0 0 2px #1f1f1f;
    }
  `]
})
export class ColorSystemComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  
  readonly loading = this.tokenService.loading;
  readonly colors = this.tokenService.colors;
  readonly colorsDark = this.tokenService.colorsDark;
  readonly categories = this.tokenService.colorCategories;
  readonly usageGuidelines = this.tokenService.usageGuidelines;
  
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('All');
  
  // Build a lookup map for quick color hex lookups
  private readonly colorLookup = computed(() => {
    const lightMap = new Map<string, string>();
    const darkMap = new Map<string, string>();
    
    for (const color of this.colors()) {
      lightMap.set(color.token, color.hex);
    }
    for (const color of this.colorsDark()) {
      darkMap.set(color.token, color.hex);
    }
    
    return { light: lightMap, dark: darkMap };
  });
  
  // Pair light and dark colors by token name
  readonly pairedColors = computed((): PairedColor[] => {
    const lightColors = this.colors();
    const darkColors = this.colorsDark();
    
    // Create a map of dark colors by token
    const darkMap = new Map<string, ColorToken>();
    for (const color of darkColors) {
      darkMap.set(color.token, color);
    }
    
    // Merge light with matching dark
    return lightColors.map(light => ({
      token: light.token,
      lightHex: light.hex,
      darkHex: darkMap.get(light.token)?.hex || null,
      usage: light.usage,
      category: light.category
    }));
  });
  
  readonly categoryOptions = computed(() => {
    const cats = this.categories().map(c => c.name);
    return ['All', ...cats];
  });
  
  // Filter paired colors by search query and category
  readonly filteredPairedColors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const selected = this.selectedCategory();
    let colors = this.pairedColors();
    
    // Filter by category first
    if (selected !== 'All') {
      colors = colors.filter(c => c.category === selected);
    }
    
    // Then filter by search query
    if (query) {
      colors = colors.filter(c => 
        c.token.toLowerCase().includes(query) ||
        c.lightHex.toLowerCase().includes(query) ||
        (c.darkHex && c.darkHex.toLowerCase().includes(query)) ||
        c.usage.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query)
      );
    }
    
    return colors;
  });
  
  // Guidelines computed properties
  readonly surfaceRules = computed(() => {
    const guidelines = this.usageGuidelines();
    if (!guidelines || !guidelines['surfaces']) return [];
    return (guidelines['surfaces'] as { rules: Array<{ component: string; light: string; dark: string; notes: string }> }).rules || [];
  });
  
  readonly textRules = computed(() => {
    const guidelines = this.usageGuidelines();
    if (!guidelines || !guidelines['text']) return [];
    return (guidelines['text'] as { rules: Array<{ use: string; token: string; notes: string }> }).rules || [];
  });
  
  readonly borderRules = computed(() => {
    const guidelines = this.usageGuidelines();
    if (!guidelines || !guidelines['borders']) return [];
    return (guidelines['borders'] as { rules: Array<{ use: string; token: string; notes: string }> }).rules || [];
  });
  
  readonly stateRules = computed(() => {
    const guidelines = this.usageGuidelines();
    if (!guidelines || !guidelines['states']) return [];
    return (guidelines['states'] as { rules: Array<{ state: string; background: string; text: string; notes: string }> }).rules || [];
  });
  
  ngOnInit(): void {
    this.tokenService.loadColors().subscribe();
  }
  
  onSearch(query: string | null): void {
    this.searchQuery.set(query || '');
  }
  
  onChipClick(category: string): void {
    this.selectedCategory.set(category);
  }
  
  /**
   * Get the hex value for a token name
   * Handles tokens that may contain slashes or multiple tokens
   */
  getColorHex(tokenName: string, theme: 'light' | 'dark'): string {
    if (!tokenName) return 'transparent';
    
    // Handle tokens with slashes (e.g., "on-app-surface / on-base")
    const firstToken = tokenName.split('/')[0].trim();
    
    // Handle tokens with pattern placeholders like {color}
    if (firstToken.includes('{')) {
      // Return a placeholder gray for pattern tokens
      return theme === 'light' ? '#e0e0e0' : '#3d3d3d';
    }
    
    const lookup = this.colorLookup();
    const map = theme === 'light' ? lookup.light : lookup.dark;
    
    return map.get(firstToken) || 'transparent';
  }
}
