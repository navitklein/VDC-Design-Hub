import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonsModule, KENDO_CHIPLIST } from '@progress/kendo-angular-buttons';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { forkJoin } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { VdcIconConcept } from '../../core/models';

interface IconTestConfig {
  style: 'regular' | 'solid' | 'light';
  color: string;
  colorHex: string;
  size: number;
  showCircle: boolean;
  circleColor: string;
}

interface ColorOption {
  name: string;
  token: string;
  hex: string;
}

/**
 * VDC Icons Component - Enhanced icon catalog with filtering and testing
 * Category is set via route data, entity filtering via chip filters
 */
@Component({
  selector: 'app-vdc-icons',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonsModule, KENDO_TEXTBOX, KENDO_CHIPLIST],
  template: `
    <div class="vdc-icons">
      <!-- Header -->
      <header class="vdc-icons__header">
        <div>
          <h1 class="vdc-heading-1">{{ categoryTitle() }}</h1>
          <p class="vdc-caption">
            Click icons to expand and test with different colors, styles, and sizes.
          </p>
        </div>
      </header>

      <!-- Filters Bar -->
      <section class="vdc-icons__filters">
        <!-- Search Input -->
        <kendo-textbox
          class="vdc-icons__search"
          placeholder="Search icons by name..."
          [value]="searchQuery()"
          (valueChange)="onSearch($event)"
          [clearButton]="true"
          [size]="'large'">
          <ng-template kendoTextBoxPrefixTemplate>
            <i class="fa-regular fa-search"></i>
          </ng-template>
        </kendo-textbox>

        <!-- Entity Filter Chips -->
        @if (entitiesWithCounts().length > 0) {
          <kendo-chiplist [selection]="'single'">
            <kendo-chip 
              label="All"
              [size]="'large'"
              [rounded]="'full'"
              [selected]="selectedEntity() === 'All'"
              (contentClick)="selectEntity('All')">
            </kendo-chip>
            @for (entity of entitiesWithCounts(); track entity.name) {
              <kendo-chip 
                [label]="entity.name + ' (' + entity.count + ')'"
                [size]="'large'"
                [rounded]="'full'"
                [selected]="selectedEntity() === entity.name"
                (contentClick)="selectEntity(entity.name)">
              </kendo-chip>
            }
          </kendo-chiplist>
        }

        <!-- TBD Filter -->
        <kendo-chiplist [selection]="'single'">
          <kendo-chip 
            [label]="'TBD Only (' + tbdCount() + ')'"
            [size]="'large'"
            [rounded]="'full'"
            [selected]="showOnlyTbd()"
            (contentClick)="toggleTbdFilter()">
          </kendo-chip>
        </kendo-chiplist>
      </section>

      <!-- Results Count -->
      <div class="vdc-icons__results">
        <span>{{ filteredIcons().length }} icon{{ filteredIcons().length !== 1 ? 's' : '' }}</span>
        @if (searchQuery() || selectedEntity() !== 'All' || showOnlyTbd()) {
          <button class="vdc-icons__clear-filters" (click)="clearAllFilters()">
            <i class="fa-regular fa-xmark"></i> Clear filters
          </button>
        }
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="vdc-icons__loading">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="vdc-skeleton" style="height: 180px;"></div>
          }
        </div>
      }

      <!-- Icon Grid -->
      @if (!loading()) {
        @if (filteredIcons().length === 0) {
          <div class="vdc-icons__empty">
            <i class="fa-regular fa-face-meh"></i>
            <p>No icons found</p>
            <button class="vdc-icons__clear-btn" (click)="clearAllFilters()">Clear filters</button>
          </div>
        } @else {
          <div class="vdc-icons__grid">
            @for (icon of filteredIcons(); track icon.name) {
              <div 
                class="icon-card"
                [class.icon-card--expanded]="expandedIcon()?.name === icon.name"
                (click)="selectIcon(icon)">
                
                <div class="icon-card__header">
                  <h3 class="icon-card__name">{{ icon.name }}</h3>
                  @if (icon.entity) {
                    <span class="icon-card__entity">
                      <i class="fa-solid fa-link"></i>
                      {{ icon.entity }}
                    </span>
                  }
                </div>
                
                <p class="icon-card__purpose">{{ icon.purpose }}</p>
                
                <!-- Icon Variants Preview -->
                <div class="icon-card__variants">
                  @for (variant of icon.variants; track variant.label) {
                    <div class="icon-card__variant">
                      <div class="icon-card__variant-preview">
                        @if (variant.fontAwesome === 'TBD') {
                          <span class="icon-card__tbd">?</span>
                        } @else if (variant.fontAwesome.startsWith('custom:')) {
                          <img src="/vdc-logo.svg" alt="VDC Logo" class="icon-card__custom-icon" />
                        } @else {
                          <i [class]="variant.fontAwesome"></i>
                        }
                      </div>
                      <span class="icon-card__variant-label">{{ variant.label }}</span>
                      @if (variant.isProduction) {
                        <span class="icon-card__production-badge">Prod</span>
                      }
                    </div>
                  }
                </div>

                <!-- Expandable Testing Panel -->
                @if (expandedIcon()?.name === icon.name) {
                  <div class="icon-card__expanded" (click)="$event.stopPropagation()">
                    <button class="icon-card__close" (click)="closeExpanded($event)">
                      <i class="fa-solid fa-times"></i>
                    </button>
                    
                    <!-- Large Icon Preview with Circle Option -->
                    <div class="expanded__preview-area">
                      <div 
                        class="expanded__icon-preview"
                        [class.expanded__icon-preview--circle]="testConfig().showCircle"
                        [style.background-color]="testConfig().showCircle ? testConfig().circleColor : 'transparent'"
                        [style.width.px]="testConfig().showCircle ? circleSize() : null"
                        [style.height.px]="testConfig().showCircle ? circleSize() : null">
                        <i 
                          [class]="getIconClass(icon, testConfig().style)"
                          [style.color]="testConfig().colorHex"
                          [style.font-size.px]="testConfig().size">
                        </i>
                      </div>
                    </div>

                    <!-- Circle Toggle with Background Options -->
                    <div class="expanded__circle-section">
                      <label class="expanded__circle-toggle">
                        <input type="checkbox" [checked]="testConfig().showCircle" (change)="toggleCircle()" />
                        Show in circle
                      </label>
                      @if (testConfig().showCircle) {
                        <div class="expanded__circle-colors">
                          @for (bg of circleBackgrounds; track bg.color) {
                            <button 
                              class="circle-color-btn"
                              [style.background-color]="bg.color"
                              [class.active]="testConfig().circleColor === bg.color"
                              (click)="setCircleColor(bg.color)"
                              [title]="bg.name">
                            </button>
                          }
                        </div>
                      }
                    </div>
                    
                    <!-- Apply Entity Colors Button -->
                    @if (icon.colorToken) {
                      <button class="entity-colors-btn" (click)="applyEntityColors(icon)">
                        <i class="fa-regular fa-palette"></i>
                        Apply Entity Colors
                      </button>
                    }
                    
                    <!-- Style Previews -->
                    <div class="expanded__section">
                      <label class="expanded__label">Style</label>
                      <div class="expanded__styles">
                        @for (style of ['regular', 'solid', 'light']; track style) {
                          <button 
                            class="expanded__style-btn"
                            [class.expanded__style-btn--active]="testConfig().style === style"
                            (click)="setTestStyle(style)">
                            <i 
                              [class]="getIconClass(icon, style)"
                              [style.font-size.px]="20">
                            </i>
                            <span>{{ style }}</span>
                          </button>
                        }
                      </div>
                    </div>

                    <!-- Color Options -->
                    <div class="expanded__section">
                      <label class="expanded__label">Color</label>
                      <div class="expanded__colors">
                        @for (color of colorOptions; track color.token) {
                          <button 
                            class="expanded__color"
                            [style.background-color]="color.hex"
                            [class.active]="testConfig().color === color.token"
                            (click)="setTestColor(color)"
                            [title]="color.name">
                          </button>
                        }
                      </div>
                    </div>

                    <!-- Size Options -->
                    <div class="expanded__section">
                      <label class="expanded__label">Size: {{ testConfig().size }}px</label>
                      <div class="expanded__sizes">
                        @for (size of sizeOptions; track size) {
                          <button 
                            class="expanded__size"
                            [class.active]="testConfig().size === size"
                            (click)="setTestSize(size)">
                            {{ size }}px
                          </button>
                        }
                      </div>
                    </div>

                    <!-- Copy Code -->
                    <div class="expanded__code">
                      <code>{{ getIconClass(icon, testConfig().style) }}</code>
                      <button (click)="copyCode(icon)"><i class="fa-regular fa-copy"></i> Copy</button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .vdc-icons {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .vdc-icons__header {
      h1 { margin: 0 0 var(--vdc-space-xs); }
      p { margin: 0; }
    }

    .vdc-icons__filters {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-md);
    }

    .vdc-icons__search {
      max-width: 400px;
    }

    .vdc-icons__results {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-md);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
    }

    .vdc-icons__clear-filters {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: none;
      border: none;
      color: var(--vdc-primary);
      font-size: var(--vdc-font-size-sm);
      cursor: pointer;
      border-radius: var(--vdc-radius-sm);

      &:hover {
        background: var(--vdc-surface-200);
      }
    }

    .vdc-icons__empty {
      text-align: center;
      padding: var(--vdc-space-xl);
      color: var(--vdc-text-secondary);

      i { font-size: 48px; margin-bottom: var(--vdc-space-md); opacity: 0.5; }
      p { margin: 0 0 var(--vdc-space-md); font-size: var(--vdc-font-size-md); }
    }

    .vdc-icons__clear-btn {
      padding: 8px 16px;
      background: var(--vdc-primary);
      color: white;
      border: none;
      border-radius: var(--vdc-radius-md);
      cursor: pointer;

      &:hover { background: var(--vdc-primary-dark, #005a9e); }
    }

    .vdc-icons__loading, .vdc-icons__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--vdc-space-md);
    }

    /* Icon Cards */
    .icon-card {
      background: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      padding: var(--vdc-space-md);
      box-shadow: var(--vdc-shadow-sm);
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;

      &:hover { box-shadow: var(--vdc-shadow-md); }
      &--expanded { 
        grid-column: span 2;
        border-color: var(--vdc-primary);
      }
    }

    .icon-card__header {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
      flex-wrap: wrap;
      margin-bottom: var(--vdc-space-xs);
    }

    .icon-card__name {
      margin: 0;
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-semibold);
    }

    .icon-card__entity {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background: #e3f2fd;
      color: #1565c0;
      border-radius: var(--vdc-radius-full);
      font-size: var(--vdc-font-size-xs);
      font-weight: var(--vdc-font-weight-semibold);

      i { font-size: 10px; }
    }

    .icon-card__purpose {
      margin: 0 0 var(--vdc-space-sm);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
    }

    .icon-card__variants {
      display: flex;
      gap: var(--vdc-space-sm);
      flex-wrap: wrap;
    }

    .icon-card__variant {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: var(--vdc-space-sm);
      background: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-md);
      min-width: 80px;
    }

    .icon-card__variant-preview {
      font-size: 24px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-card__variant-label {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
    }

    .icon-card__production-badge {
      font-size: 9px;
      padding: 1px 4px;
      background: var(--vdc-success);
      color: white;
      border-radius: var(--vdc-radius-sm);
    }

    .icon-card__tbd {
      font-size: 24px;
      font-weight: bold;
      color: var(--vdc-text-disabled);
    }

    .icon-card__custom-icon {
      width: 24px;
      height: 24px;
    }

    /* Expanded Card */
    .icon-card__expanded {
      margin-top: var(--vdc-space-md);
      padding-top: var(--vdc-space-md);
      border-top: 1px solid var(--vdc-border-subtle);
      position: relative;
    }

    .icon-card__close {
      position: absolute;
      top: var(--vdc-space-sm);
      right: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--vdc-text-secondary);
      padding: 4px 8px;
      border-radius: var(--vdc-radius-sm);

      &:hover { 
        color: var(--vdc-text-primary); 
        background: var(--vdc-surface-200);
      }
    }

    /* Large Icon Preview */
    .expanded__preview-area {
      display: flex;
      justify-content: center;
      padding: var(--vdc-space-lg);
      margin-bottom: var(--vdc-space-md);
      background: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-lg);
    }

    .expanded__icon-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &--circle {
        border-radius: 50%;
      }
    }

    /* Circle Section */
    .expanded__circle-section {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-md);
      margin-bottom: var(--vdc-space-md);
      flex-wrap: wrap;
    }

    .expanded__circle-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--vdc-font-size-sm);
      cursor: pointer;
      color: var(--vdc-text-primary);

      input { cursor: pointer; }
    }

    .expanded__circle-colors {
      display: flex;
      gap: 6px;
    }

    /* Entity Colors Button */
    .entity-colors-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      margin-bottom: var(--vdc-space-md);
      background: var(--vdc-surface-200);
      border: 1px solid var(--vdc-border-default);
      border-radius: var(--vdc-radius-md);
      color: var(--vdc-text-primary);
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-semibold);
      cursor: pointer;
      transition: all 0.15s;

      i { font-size: var(--vdc-font-size-md); }

      &:hover {
        background: var(--vdc-primary);
        border-color: var(--vdc-primary);
        color: white;
      }
    }

    .circle-color-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid var(--vdc-border-default);
      cursor: pointer;
      transition: all 0.15s;

      &:hover { transform: scale(1.1); }
      &.active { 
        border-color: var(--vdc-primary);
        box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.3);
      }
    }

    /* Sections */
    .expanded__section {
      margin-bottom: var(--vdc-space-md);
    }

    .expanded__label {
      display: block;
      font-size: var(--vdc-font-size-xs);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-secondary);
      margin-bottom: var(--vdc-space-xs);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .expanded__styles {
      display: flex;
      gap: var(--vdc-space-sm);
    }

    .expanded__style-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: var(--vdc-space-sm) var(--vdc-space-md);
      border: 2px solid var(--vdc-border-default);
      border-radius: var(--vdc-radius-md);
      background: var(--vdc-surface-100);
      cursor: pointer;
      transition: all 0.15s;

      &:hover { background: var(--vdc-surface-200); }
      &--active { 
        border-color: var(--vdc-primary);
        background: var(--vdc-surface-200);
      }

      span { 
        font-size: var(--vdc-font-size-xs); 
        text-transform: capitalize;
        color: var(--vdc-text-secondary);
      }
    }

    .expanded__colors {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .expanded__color {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.15s;

      &:hover { transform: scale(1.1); }
      &.active { 
        border-color: var(--vdc-text-primary);
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
      }
    }

    .expanded__sizes {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .expanded__size {
      padding: 6px 12px;
      font-size: var(--vdc-font-size-xs);
      border: 1px solid var(--vdc-border-default);
      border-radius: var(--vdc-radius-md);
      background: var(--vdc-surface-100);
      cursor: pointer;
      transition: all 0.15s;

      &:hover { background: var(--vdc-surface-200); }
      &.active {
        background: var(--vdc-primary);
        border-color: var(--vdc-primary);
        color: white;
      }
    }

    .expanded__code {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
      padding: var(--vdc-space-sm) var(--vdc-space-md);
      background: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-md);

      code { 
        flex: 1; 
        font-size: var(--vdc-font-size-sm);
        color: var(--vdc-text-primary);
        font-family: 'Consolas', 'Monaco', monospace;
      }

      button {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        background: var(--vdc-surface-100);
        border: 1px solid var(--vdc-border-default);
        border-radius: var(--vdc-radius-sm);
        cursor: pointer;
        font-size: var(--vdc-font-size-xs);
        color: var(--vdc-text-secondary);
        transition: all 0.15s;

        &:hover { 
          background: var(--vdc-primary);
          border-color: var(--vdc-primary);
          color: white;
        }
      }
    }
  `]
})
export class VdcIconsComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  private readonly route = inject(ActivatedRoute);
  
  readonly loading = this.tokenService.loading;
  readonly vdcIcons = this.tokenService.vdcIcons;
  readonly categories = this.tokenService.vdcIconCategories;
  
  // Category from route
  readonly selectedCategory = signal<string>('All');
  
  // Filters
  readonly selectedEntity = signal<string>('All');
  readonly searchQuery = signal<string>('');
  readonly showOnlyTbd = signal<boolean>(false);
  
  // UI State
  readonly expandedIcon = signal<VdcIconConcept | null>(null);
  
  // Test configuration
  readonly testConfig = signal<IconTestConfig>({
    style: 'regular',
    color: 'vdc-primary',
    colorHex: '#0078d4',
    size: 32,
    showCircle: false,
    circleColor: '#f8e8f0'
  });
  
  // Color options - includes standard colors and entity colors
  readonly colorOptions: ColorOption[] = [
    { name: 'Default Icon', token: 'vdc-icon-default', hex: '#242424' },
    { name: 'Primary', token: 'vdc-primary', hex: '#0078d4' },
    { name: 'Success', token: 'vdc-success', hex: '#107c10' },
    { name: 'Warning', token: 'vdc-warning', hex: '#ffb900' },
    { name: 'Error', token: 'vdc-error', hex: '#d13438' },
    { name: 'Text', token: 'vdc-text-primary', hex: '#323130' },
    { name: 'Secondary', token: 'vdc-text-secondary', hex: '#605e5c' },
    { name: 'Ingredient', token: 'vdc-entity-ingredient', hex: '#5E4DB2' },
    { name: 'Release', token: 'vdc-entity-release', hex: '#943D73' },
    { name: 'Workflow', token: 'vdc-entity-workflow', hex: '#F5CD47' },
    { name: 'Project', token: 'vdc-context-project', hex: '#0B4F8A' },
    { name: 'Personal', token: 'vdc-context-personal', hex: '#2E7D6B' }
  ];
  
  // Circle background options
  readonly circleBackgrounds = [
    { name: 'Light Pink', color: '#f8e8f0' },
    { name: 'Light Purple', color: '#ede8f5' },
    { name: 'Light Blue', color: '#deecf9' },
    { name: 'Light Green', color: '#dff6dd' },
    { name: 'Light Yellow', color: '#fff4ce' },
    { name: 'Light Gray', color: '#f3f2f1' },
    { name: 'White', color: '#ffffff' }
  ];
  
  readonly sizeOptions = [16, 24, 32, 48, 64];
  
  private readonly circleSizeMultiplier = 1.8;
  
  readonly circleSize = computed(() => Math.round(this.testConfig().size * this.circleSizeMultiplier));
  
  // Category title for header
  readonly categoryTitle = computed(() => {
    const cat = this.selectedCategory();
    return cat === 'All' ? 'All Icons' : `${cat} Icons`;
  });
  
  // TBD icons count (within selected category)
  readonly tbdCount = computed(() => {
    return this.iconsInCategory().filter(icon => 
      icon.variants.some(v => v.fontAwesome === 'TBD')
    ).length;
  });
  
  // Icons filtered by category only
  readonly iconsInCategory = computed(() => {
    let icons = this.vdcIcons();
    
    if (this.selectedCategory() !== 'All') {
      icons = icons.filter(i => i.category === this.selectedCategory());
    }
    
    return icons;
  });
  
  // Entities with counts (based on selected category)
  readonly entitiesWithCounts = computed(() => {
    const icons = this.iconsInCategory();
    const countMap = new Map<string, number>();
    
    icons.forEach(icon => {
      if (icon.entity) {
        const count = countMap.get(icon.entity) || 0;
        countMap.set(icon.entity, count + 1);
      }
    });
    
    return Array.from(countMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });
  
  // Fully filtered icons
  readonly filteredIcons = computed(() => {
    let icons = this.iconsInCategory();
    
    // Filter by entity
    if (this.selectedEntity() !== 'All') {
      icons = icons.filter(i => i.entity === this.selectedEntity());
    }
    
    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      icons = icons.filter(i => 
        i.name.toLowerCase().includes(query) ||
        i.purpose.toLowerCase().includes(query)
      );
    }
    
    // Filter TBD only
    if (this.showOnlyTbd()) {
      icons = icons.filter(i => 
        i.variants.some(v => v.fontAwesome === 'TBD')
      );
    }
    
    return icons;
  });
  
  constructor() {
    // Listen to route data changes for category
    effect(() => {
      // This will be populated from route subscription in ngOnInit
    });
  }
  
  ngOnInit(): void {
    // Load both VDC icons and colors for entity color lookup
    forkJoin({
      icons: this.tokenService.loadVdcIcons(),
      colors: this.tokenService.loadColors()
    }).subscribe();
    
    // Subscribe to route data for category
    this.route.data.subscribe(data => {
      if (data['category']) {
        this.selectedCategory.set(data['category']);
        this.selectedEntity.set('All'); // Reset entity filter when category changes
      }
    });
  }
  
  onSearch(query: string | null): void {
    this.searchQuery.set(query || '');
  }
  
  clearAllFilters(): void {
    this.selectedEntity.set('All');
    this.searchQuery.set('');
    this.showOnlyTbd.set(false);
  }
  
  toggleTbdFilter(): void {
    this.showOnlyTbd.update(v => !v);
  }
  
  selectEntity(entity: string): void {
    this.selectedEntity.set(entity);
  }
  
  selectIcon(icon: VdcIconConcept): void {
    if (this.expandedIcon()?.name === icon.name) {
      this.expandedIcon.set(null);
    } else {
      this.expandedIcon.set(icon);
      this.applyEntityColors(icon);
    }
  }
  
  closeExpanded(event: Event): void {
    event.stopPropagation();
    this.expandedIcon.set(null);
  }
  
  setTestStyle(style: string): void {
    this.testConfig.update(c => ({ ...c, style: style as 'regular' | 'solid' | 'light' }));
  }
  
  setTestColor(color: ColorOption): void {
    this.testConfig.update(c => ({ ...c, color: color.token, colorHex: color.hex }));
  }
  
  setTestSize(size: number): void {
    this.testConfig.update(c => ({ ...c, size }));
  }
  
  toggleCircle(): void {
    this.testConfig.update(c => ({ ...c, showCircle: !c.showCircle }));
  }
  
  setCircleColor(color: string): void {
    this.testConfig.update(c => ({ ...c, circleColor: color }));
  }
  
  getIconClass(icon: VdcIconConcept, style: string): string {
    const firstVariant = icon.variants[0];
    if (!firstVariant || firstVariant.fontAwesome === 'TBD' || firstVariant.fontAwesome.startsWith('custom:')) {
      return '';
    }
    
    if (firstVariant.fontAwesome.startsWith('fa-kit')) {
      return firstVariant.fontAwesome;
    }
    
    const parts = firstVariant.fontAwesome.split(' ');
    const iconName = parts.length > 1 ? parts[1] : parts[0];
    
    return `fa-${style} ${iconName}`;
  }
  
  copyCode(icon: VdcIconConcept): void {
    const code = this.getIconClass(icon, this.testConfig().style);
    navigator.clipboard.writeText(code).then(() => {
      console.log('Copied:', code);
    });
  }
  
  applyEntityColors(icon: VdcIconConcept): void {
    if (!icon.colorToken) {
      this.testConfig.update(c => ({
        ...c,
        color: 'vdc-icon-default',
        colorHex: '#242424'
      }));
      return;
    }
    
    const entityColor = this.tokenService.findColor(icon.colorToken);
    const lightColor = this.tokenService.findColor(`${icon.colorToken}-light`);
    
    if (entityColor) {
      this.testConfig.update(c => ({
        ...c,
        color: icon.colorToken!,
        colorHex: entityColor.hex,
        showCircle: true,
        circleColor: lightColor?.hex || '#f3f2f1'
      }));
    } else {
      this.testConfig.update(c => ({
        ...c,
        color: 'vdc-icon-default',
        colorHex: '#242424'
      }));
    }
  }
}
