import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TokenService } from '../../../core/services/token.service';
import { IconToken } from '../../../core/models';

/**
 * Iconography Component - Displays all system icons with their entity mappings
 */
@Component({
  selector: 'app-iconography',
  standalone: true,
  imports: [CommonModule, DropDownListModule],
  template: `
    <div class="iconography">
      <header class="iconography__header">
        <div>
          <h1 class="vdc-heading-1">Iconography</h1>
          <p class="vdc-caption">System icons with entity mappings and usage guidelines</p>
        </div>

        <kendo-dropdownlist
          [data]="categoryOptions()"
          [value]="selectedCategory()"
          (valueChange)="onCategoryChange($event)"
          class="iconography__filter">
        </kendo-dropdownlist>
      </header>

      @if (loading()) {
        <div class="iconography__loading">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="vdc-skeleton" style="height: 140px;"></div>
          }
        </div>
      }

      @if (!loading()) {
        <!-- Icons Grid -->
        <div class="iconography__grid">
          @for (icon of filteredIcons(); track icon.name) {
            <div class="icon-card">
              <div class="icon-card__preview">
                <i [class]="'fa-solid ' + icon.fontAwesome" 
                   [style.color]="'var(--' + icon.colorToken + ')'"></i>
              </div>
              <div class="icon-card__info">
                <h3 class="icon-card__name">{{ icon.name }}</h3>
                @if (icon.entity) {
                  <span class="icon-card__entity">
                    <i class="fa-solid fa-link"></i>
                    {{ icon.entity }}
                  </span>
                }
                <p class="icon-card__usage">{{ icon.usage }}</p>
                <div class="icon-card__meta">
                  <span class="icon-card__sizes">
                    Sizes: {{ icon.sizes.join(', ') }}
                  </span>
                  <code class="icon-card__fa">{{ icon.fontAwesome }}</code>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .iconography {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .iconography__header {
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

    .iconography__filter {
      width: 180px;
    }

    .iconography__loading,
    .iconography__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: var(--vdc-space-md);
    }

    .icon-card {
      background-color: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      overflow: hidden;
      box-shadow: var(--vdc-shadow-sm);
    }

    .icon-card__preview {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--vdc-surface-200);

      i {
        font-size: 32px;
      }
    }

    .icon-card__info {
      padding: var(--vdc-space-md);
    }

    .icon-card__name {
      margin: 0 0 var(--vdc-space-xs);
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
      text-transform: capitalize;
    }

    .icon-card__entity {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background-color: #e3f2fd;
      color: #1565c0;
      border-radius: var(--vdc-radius-full);
      font-size: var(--vdc-font-size-xs);
      font-weight: var(--vdc-font-weight-semibold);
      margin-bottom: var(--vdc-space-xs);

      i {
        font-size: 10px;
      }
    }

    .icon-card__usage {
      margin: var(--vdc-space-xs) 0 var(--vdc-space-sm);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
      line-height: var(--vdc-line-height-normal);
    }

    .icon-card__meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--vdc-space-sm);
      flex-wrap: wrap;
    }

    .icon-card__sizes {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-disabled);
    }

    .icon-card__fa {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
      background-color: var(--vdc-surface-300);
      padding: 2px 6px;
      border-radius: var(--vdc-radius-sm);
    }
  `]
})
export class IconographyComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  
  readonly loading = this.tokenService.loading;
  readonly icons = this.tokenService.icons;
  readonly categories = this.tokenService.iconCategories;
  
  readonly selectedCategory = signal<string>('All');
  
  readonly categoryOptions = computed(() => {
    const cats = this.categories().map(c => c.name);
    return ['All', ...cats];
  });
  
  readonly filteredIcons = computed(() => {
    const selected = this.selectedCategory();
    if (selected === 'All') {
      return this.icons();
    }
    return this.icons().filter(i => i.category === selected);
  });
  
  ngOnInit(): void {
    this.tokenService.loadIcons().subscribe();
  }
  
  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
  }
}
