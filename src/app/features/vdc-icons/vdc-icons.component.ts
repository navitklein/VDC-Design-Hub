import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
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
 */
@Component({
  selector: 'app-vdc-icons',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonsModule, InputsModule],
  template: `
    <div class="vdc-icons">
      <!-- Category Sidebar -->
      <aside class="category-sidebar">
        <h3 class="sidebar-title">Categories</h3>
        <ul class="category-list">
          <li>
            <button 
              class="category-item"
              [class.category-item--active]="selectedCategory() === 'All'"
              (click)="selectCategory('All')">
              <span class="category-name">All</span>
              <span class="category-count">{{ totalIconCount() }}</span>
            </button>
          </li>
          @for (cat of categoriesWithCounts(); track cat.name) {
            <li>
              <button 
                class="category-item"
                [class.category-item--active]="selectedCategory() === cat.name"
                (click)="selectCategory(cat.name)">
                <span class="category-name">{{ cat.name }}</span>
                <span class="category-count">{{ cat.count }}</span>
              </button>
            </li>
          }
        </ul>
      </aside>

      <!-- Main Content Area -->
      <div class="vdc-icons__main">
        <!-- Header -->
        <header class="vdc-icons__header">
          <div>
            <h1 class="vdc-heading-1">VDC Icons</h1>
            <p class="vdc-caption">
              Icon catalog for VDC design system. Click icons to expand and test with different colors, styles, and sizes.
            </p>
          </div>
        </header>

        <!-- Search and Entity Filters -->
        <section class="filters-bar">
          <!-- Search Input -->
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text" 
              class="search-input"
              placeholder="Search icons by name..."
              [value]="searchQuery()"
              (input)="onSearchInput($event)" />
            @if (searchQuery()) {
              <button class="search-clear" (click)="clearSearch()">
                <i class="fa-solid fa-times"></i>
              </button>
            }
          </div>

          <!-- Entity Filter Chips -->
          <div class="entity-filters">
            <span class="filter-label">Entity:</span>
            <div class="filter-chips">
              <button 
                class="filter-chip"
                [class.filter-chip--active]="selectedEntity() === 'All'"
                (click)="selectEntity('All')">
                All ({{ filteredByCategory().length }})
              </button>
              @for (entity of entitiesWithCounts(); track entity.name) {
                <button 
                  class="filter-chip"
                  [class.filter-chip--active]="selectedEntity() === entity.name"
                  (click)="selectEntity(entity.name)">
                  {{ entity.name }} ({{ entity.count }})
                </button>
              }
            </div>
          </div>
        </section>

        <!-- Results Count -->
        <div class="results-info">
          <span>{{ filteredIcons().length }} icon{{ filteredIcons().length !== 1 ? 's' : '' }}</span>
          @if (searchQuery() || selectedCategory() !== 'All' || selectedEntity() !== 'All') {
            <button class="clear-filters" (click)="clearAllFilters()">
              <i class="fa-solid fa-times"></i> Clear filters
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
            <div class="empty-state">
              <i class="fa-regular fa-face-meh"></i>
              <p>No icons found</p>
              <button class="clear-filters-btn" (click)="clearAllFilters()">Clear filters</button>
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
                          [style.width.px]="testConfig().showCircle ? testConfig().size * 2.5 : 'auto'"
                          [style.height.px]="testConfig().showCircle ? testConfig().size * 2.5 : 'auto'">
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
    </div>
  `,
  styles: [`
    .vdc-icons {
      display: flex;
      gap: var(--vdc-space-lg);
      min-height: calc(100vh - 120px);
    }

    /* Category Sidebar */
    .category-sidebar {
      width: 220px;
      flex-shrink: 0;
      background: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      padding: var(--vdc-space-md);
      box-shadow: var(--vdc-shadow-sm);
      position: sticky;
      top: 80px;
      height: fit-content;
      max-height: calc(100vh - 100px);
      overflow-y: auto;
    }

    .sidebar-title {
      margin: 0 0 var(--vdc-space-md);
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .category-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .category-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--vdc-space-sm) var(--vdc-space-md);
      border: none;
      border-radius: var(--vdc-radius-md);
      background: transparent;
      color: var(--vdc-text-primary);
      font-size: var(--vdc-font-size-sm);
      cursor: pointer;
      transition: all 0.15s;
      text-align: left;

      &:hover {
        background: var(--vdc-surface-200);
      }

      &--active {
        background: var(--vdc-primary);
        color: white;

        .category-count {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
      }
    }

    .category-name {
      font-weight: var(--vdc-font-weight-medium);
    }

    .category-count {
      padding: 2px 8px;
      background: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-full);
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
      font-weight: var(--vdc-font-weight-semibold);
    }

    /* Main Content */
    .vdc-icons__main {
      flex: 1;
      min-width: 0;
    }

    .vdc-icons__header {
      margin-bottom: var(--vdc-space-lg);

      h1 { margin: 0 0 var(--vdc-space-xs); }
      p { margin: 0; }
    }

    /* Filters Bar */
    .filters-bar {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-md);
      margin-bottom: var(--vdc-space-md);
    }

    /* Search Box */
    .search-box {
      position: relative;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-sm);
    }

    .search-input {
      width: 100%;
      padding: 10px 36px 10px 36px;
      border: 1px solid var(--vdc-border-default);
      border-radius: var(--vdc-radius-md);
      font-size: var(--vdc-font-size-sm);
      background: var(--vdc-surface-100);
      color: var(--vdc-text-primary);
      transition: border-color 0.15s, box-shadow 0.15s;

      &:focus {
        outline: none;
        border-color: var(--vdc-primary);
        box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.1);
      }

      &::placeholder {
        color: var(--vdc-text-disabled);
      }
    }

    .search-clear {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--vdc-text-secondary);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--vdc-radius-sm);

      &:hover {
        color: var(--vdc-text-primary);
        background: var(--vdc-surface-200);
      }
    }

    /* Entity Filters */
    .entity-filters {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
      flex-wrap: wrap;
    }

    .filter-label {
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-secondary);
    }

    .filter-chips {
      display: flex;
      gap: var(--vdc-space-xs);
      flex-wrap: wrap;
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

    /* Results Info */
    .results-info {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-md);
      margin-bottom: var(--vdc-space-md);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
    }

    .clear-filters {
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

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: var(--vdc-space-xl) var(--vdc-space-lg);
      color: var(--vdc-text-secondary);

      i {
        font-size: 48px;
        margin-bottom: var(--vdc-space-md);
        opacity: 0.5;
      }

      p {
        margin: 0 0 var(--vdc-space-md);
        font-size: var(--vdc-font-size-md);
      }
    }

    .clear-filters-btn {
      padding: 8px 16px;
      background: var(--vdc-primary);
      color: white;
      border: none;
      border-radius: var(--vdc-radius-md);
      cursor: pointer;

      &:hover {
        background: var(--vdc-primary-dark, #005a9e);
      }
    }

    /* Loading & Grid */
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
      min-width: 80px;
      min-height: 80px;
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

    .circle-color-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid var(--vdc-border-default);
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        transform: scale(1.1);
      }

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

      &:hover { 
        background: var(--vdc-surface-200); 
      }

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

      &:hover {
        transform: scale(1.1);
      }

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

      &:hover {
        background: var(--vdc-surface-200);
      }

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
  
  readonly loading = this.tokenService.loading;
  readonly vdcIcons = this.tokenService.vdcIcons;
  readonly categories = this.tokenService.vdcIconCategories;
  
  // Filters
  readonly selectedCategory = signal<string>('All');
  readonly selectedEntity = signal<string>('All');
  readonly searchQuery = signal<string>('');
  
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
  
  // Color options
  readonly colorOptions: ColorOption[] = [
    { name: 'Primary', token: 'vdc-primary', hex: '#0078d4' },
    { name: 'Success', token: 'vdc-success', hex: '#107c10' },
    { name: 'Warning', token: 'vdc-warning', hex: '#ffb900' },
    { name: 'Error', token: 'vdc-error', hex: '#d13438' },
    { name: 'Text', token: 'vdc-text-primary', hex: '#323130' },
    { name: 'Secondary', token: 'vdc-text-secondary', hex: '#605e5c' },
    { name: 'Purple', token: 'vdc-purple', hex: '#8764b8' }
  ];
  
  // Circle background options (including the pink from the image)
  readonly circleBackgrounds = [
    { name: 'Light Pink', color: '#f8e8f0' },
    { name: 'Light Purple', color: '#ede8f5' },
    { name: 'Light Blue', color: '#deecf9' },
    { name: 'Light Green', color: '#dff6dd' },
    { name: 'Light Yellow', color: '#fff4ce' },
    { name: 'Light Gray', color: '#f3f2f1' },
    { name: 'White', color: '#ffffff' }
  ];
  
  // Size options
  readonly sizeOptions = [16, 24, 32, 48, 64];
  
  // Total icon count
  readonly totalIconCount = computed(() => this.vdcIcons().length);
  
  // Categories with counts (always based on all icons)
  readonly categoriesWithCounts = computed(() => {
    const icons = this.vdcIcons();
    const countMap = new Map<string, number>();
    
    icons.forEach(icon => {
      const count = countMap.get(icon.category) || 0;
      countMap.set(icon.category, count + 1);
    });
    
    return this.categories().map(cat => ({
      name: cat.name,
      count: countMap.get(cat.name) || 0
    }));
  });
  
  // Icons filtered by category only (for entity count calculation)
  readonly filteredByCategory = computed(() => {
    let icons = this.vdcIcons();
    
    if (this.selectedCategory() !== 'All') {
      icons = icons.filter(i => i.category === this.selectedCategory());
    }
    
    return icons;
  });
  
  // Entities with counts (based on selected category)
  readonly entitiesWithCounts = computed(() => {
    const icons = this.filteredByCategory();
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
  
  // Fully filtered icons (category + entity + search)
  readonly filteredIcons = computed(() => {
    let icons = this.vdcIcons();
    
    // Filter by category
    if (this.selectedCategory() !== 'All') {
      icons = icons.filter(i => i.category === this.selectedCategory());
    }
    
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
    
    return icons;
  });
  
  ngOnInit(): void {
    this.tokenService.loadVdcIcons().subscribe();
  }
  
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
  
  clearSearch(): void {
    this.searchQuery.set('');
  }
  
  clearAllFilters(): void {
    this.selectedCategory.set('All');
    this.selectedEntity.set('All');
    this.searchQuery.set('');
  }
  
  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.selectedEntity.set('All'); // Reset entity filter when category changes
  }
  
  selectEntity(entity: string): void {
    this.selectedEntity.set(entity);
  }
  
  selectIcon(icon: VdcIconConcept): void {
    // Toggle expand if clicking same icon, otherwise expand new one
    if (this.expandedIcon()?.name === icon.name) {
      this.expandedIcon.set(null);
    } else {
      this.expandedIcon.set(icon);
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
    // Get the base icon name from the first variant
    const firstVariant = icon.variants[0];
    if (!firstVariant || firstVariant.fontAwesome === 'TBD' || firstVariant.fontAwesome.startsWith('custom:')) {
      return '';
    }
    
    // Extract icon name (e.g., "fa-rocket-launch" from "fa-regular fa-rocket-launch")
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
}
