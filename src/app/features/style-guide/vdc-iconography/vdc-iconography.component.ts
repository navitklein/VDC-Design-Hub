import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TokenService } from '../../../core/services/token.service';
import { VdcIconConcept } from '../../../core/models';

/**
 * VDC Iconography Component - Displays VDC icons with comparison variants
 * Each icon concept can show Current (production) vs Alternative options
 */
@Component({
  selector: 'app-vdc-iconography',
  standalone: true,
  imports: [CommonModule, DropDownListModule],
  template: `
    <div class="vdc-iconography">
      <header class="vdc-iconography__header">
        <div>
          <h1 class="vdc-heading-1">VDC Icons</h1>
          <p class="vdc-caption">
            VDC-specific icons with production status and alternatives for comparison.
            Use the Font Awesome class names shown below.
          </p>
        </div>

        <kendo-dropdownlist
          [data]="categoryOptions()"
          [value]="selectedCategory()"
          (valueChange)="onCategoryChange($event)"
          class="vdc-iconography__filter">
        </kendo-dropdownlist>
      </header>

      @if (loading()) {
        <div class="vdc-iconography__loading">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="vdc-skeleton" style="height: 200px;"></div>
          }
        </div>
      }

      @if (!loading()) {
        <div class="vdc-iconography__grid">
          @for (icon of filteredIcons(); track icon.name) {
            <div class="icon-concept-card">
              <div class="icon-concept-card__header">
                <h3 class="icon-concept-card__name">{{ icon.name }}</h3>
                @if (icon.entity) {
                  <span class="icon-concept-card__entity">
                    <i class="fa-solid fa-link"></i>
                    {{ icon.entity }}
                  </span>
                }
              </div>
              <p class="icon-concept-card__purpose">{{ icon.purpose }}</p>
              
              <div class="icon-concept-card__variants">
                @for (variant of icon.variants; track variant.label) {
                  <div class="variant" [class.variant--production]="variant.isProduction" [class.variant--tbd]="variant.fontAwesome === 'TBD'">
                    <div class="variant__badges">
                      <span class="variant__label">{{ variant.label }}</span>
                      @if (variant.isProduction) {
                        <span class="variant__production-badge">Production</span>
                      }
                    </div>
                    
                    <div class="variant__preview">
                      @if (variant.fontAwesome === 'TBD') {
                        <span class="variant__tbd">?</span>
                      } @else if (variant.fontAwesome.startsWith('custom:')) {
                        <img [src]="'/vdc-logo.svg'" alt="VDC Logo" class="variant__custom-icon" />
                      } @else {
                        <i [class]="variant.fontAwesome"></i>
                      }
                    </div>
                    
                    <div class="variant__fa-class" (click)="copyToClipboard(variant.fontAwesome)">
                      @if (variant.fontAwesome === 'TBD') {
                        <span class="variant__tbd-text">Not chosen yet</span>
                      } @else if (variant.fontAwesome.startsWith('custom:')) {
                        <code>vdc-logo.svg</code>
                      } @else {
                        <code>{{ variant.fontAwesome }}</code>
                      }
                      @if (variant.fontAwesome !== 'TBD' && !variant.fontAwesome.startsWith('custom:')) {
                        <i class="fa-regular fa-copy variant__copy-icon"></i>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .vdc-iconography {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .vdc-iconography__header {
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
        max-width: 600px;
      }
    }

    .vdc-iconography__filter {
      width: 200px;
    }

    .vdc-iconography__loading,
    .vdc-iconography__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--vdc-space-md);
    }

    .icon-concept-card {
      background-color: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      padding: var(--vdc-space-md);
      box-shadow: var(--vdc-shadow-sm);
    }

    .icon-concept-card__header {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
      flex-wrap: wrap;
      margin-bottom: var(--vdc-space-xs);
    }

    .icon-concept-card__name {
      margin: 0;
      font-size: var(--vdc-font-size-lg);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
    }

    .icon-concept-card__entity {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background-color: #e3f2fd;
      color: #1565c0;
      border-radius: var(--vdc-radius-full);
      font-size: var(--vdc-font-size-xs);
      font-weight: var(--vdc-font-weight-semibold);

      i {
        font-size: 10px;
      }
    }

    .icon-concept-card__purpose {
      margin: 0 0 var(--vdc-space-md);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
      line-height: var(--vdc-line-height-normal);
    }

    .icon-concept-card__variants {
      display: flex;
      gap: var(--vdc-space-sm);
      flex-wrap: wrap;
    }

    .variant {
      flex: 1;
      min-width: 120px;
      background-color: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-md);
      padding: var(--vdc-space-sm);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--vdc-space-xs);
      border: 2px solid transparent;
      transition: border-color 0.2s ease;
    }

    .variant--production {
      border-color: var(--vdc-success, #4caf50);
    }

    .variant--tbd {
      opacity: 0.6;
      border-style: dashed;
      border-color: var(--vdc-text-disabled);
    }

    .variant__badges {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-xs);
      flex-wrap: wrap;
      justify-content: center;
    }

    .variant__label {
      font-size: var(--vdc-font-size-xs);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .variant__production-badge {
      font-size: 10px;
      padding: 1px 6px;
      background-color: var(--vdc-success, #4caf50);
      color: white;
      border-radius: var(--vdc-radius-full);
      font-weight: var(--vdc-font-weight-semibold);
    }

    .variant__preview {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 32px;
        color: var(--vdc-icon-primary, var(--vdc-text-primary));
      }
    }

    .variant__tbd {
      font-size: 32px;
      font-weight: bold;
      color: var(--vdc-text-disabled);
    }

    .variant__custom-icon {
      width: 32px;
      height: 32px;
    }

    .variant__fa-class {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 4px 8px;
      background-color: var(--vdc-surface-300);
      border-radius: var(--vdc-radius-sm);
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--vdc-surface-400, #d0d0d0);
      }

      code {
        font-size: var(--vdc-font-size-xs);
        color: var(--vdc-text-secondary);
        word-break: break-all;
        text-align: center;
      }
    }

    .variant__copy-icon {
      font-size: 12px;
      color: var(--vdc-text-disabled);
    }

    .variant__tbd-text {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-disabled);
      font-style: italic;
    }
  `]
})
export class VdcIconographyComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  
  readonly loading = this.tokenService.loading;
  readonly vdcIcons = this.tokenService.vdcIcons;
  readonly categories = this.tokenService.vdcIconCategories;
  
  readonly selectedCategory = signal<string>('All');
  
  readonly categoryOptions = computed(() => {
    const cats = this.categories().map(c => c.name);
    return ['All', ...cats];
  });
  
  readonly filteredIcons = computed(() => {
    const selected = this.selectedCategory();
    if (selected === 'All') {
      return this.vdcIcons();
    }
    return this.vdcIcons().filter(i => i.category === selected);
  });
  
  ngOnInit(): void {
    this.tokenService.loadVdcIcons().subscribe();
  }
  
  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
  }
  
  copyToClipboard(text: string): void {
    if (text === 'TBD' || text.startsWith('custom:')) return;
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard:', text);
    });
  }
}
