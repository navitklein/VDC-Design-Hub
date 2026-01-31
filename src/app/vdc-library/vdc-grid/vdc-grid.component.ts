import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';

/**
 * VDC Grid Component
 * 
 * Standardized data grid wrapper over Kendo Grid with VDC styling.
 * Includes built-in pagination, sorting, and loading states.
 * 
 * @example
 * <vdc-grid 
 *   [data]="items"
 *   [loading]="isLoading"
 *   [pageSize]="20"
 *   [sortable]="true">
 *   <kendo-grid-column field="name" title="Name"></kendo-grid-column>
 *   <kendo-grid-column field="status" title="Status"></kendo-grid-column>
 * </vdc-grid>
 */
@Component({
  selector: 'vdc-grid',
  standalone: true,
  imports: [CommonModule, GridModule],
  template: `
    <div class="vdc-grid" [class.vdc-grid--loading]="loading">
      @if (loading) {
        <div class="vdc-grid__loading-overlay">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <span>Loading...</span>
        </div>
      }

      <kendo-grid
        [data]="gridData"
        [pageSize]="pageSize"
        [skip]="skip"
        [pageable]="pageable"
        [sortable]="sortable"
        [sort]="sort"
        [height]="gridHeight"
        [selectable]="selectable"
        (pageChange)="onPageChange($event)"
        (sortChange)="onSortChange($event)"
        (selectionChange)="onSelectionChange($event)"
        class="vdc-grid__table">
        <ng-content></ng-content>
        
        @if (emptyTemplate && (!data || data.length === 0) && !loading) {
          <ng-template kendoGridNoRecordsTemplate>
            <ng-container *ngTemplateOutlet="emptyTemplate"></ng-container>
          </ng-template>
        }
      </kendo-grid>
    </div>
  `,
  styles: [`
    .vdc-grid {
      position: relative;
    }

    .vdc-grid--loading {
      .vdc-grid__table {
        opacity: 0.5;
        pointer-events: none;
      }
    }

    .vdc-grid__loading-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--vdc-space-sm);
      color: var(--vdc-primary);
      font-size: var(--vdc-font-size-md);

      i {
        font-size: 24px;
      }
    }

    ::ng-deep {
      .k-grid {
        font-family: var(--vdc-font-family);
        border-radius: var(--vdc-radius-lg);
        overflow: hidden;
      }

      .k-grid-header {
        background-color: var(--vdc-surface-200);
      }

      .k-grid-content {
        background-color: var(--vdc-surface-100);
      }

      .k-alt {
        background-color: var(--vdc-surface-200);
      }

      .k-grid-pager {
        border-top: 1px solid var(--vdc-border-subtle);
      }
    }
  `]
})
export class VdcGridComponent {
  /** Data array to display */
  @Input() data: any[] = [];
  
  /** Whether the grid is loading */
  @Input() loading = false;
  
  /** Number of items per page */
  @Input() pageSize = 10;
  
  /** Current skip value for pagination */
  @Input() skip = 0;
  
  /** Whether pagination is enabled */
  @Input() pageable = true;
  
  /** Whether sorting is enabled */
  @Input() sortable = true;
  
  /** Current sort descriptors */
  @Input() sort: SortDescriptor[] = [];
  
  /** Grid height (number or 'auto') */
  @Input() height?: number;
  
  /** Grid height with default for Kendo binding */
  get gridHeight(): number {
    return this.height ?? 400;
  }
  
  /** Whether row selection is enabled */
  @Input() selectable = false;
  
  /** Total count for server-side pagination */
  @Input() total?: number;
  
  /** Custom empty state template */
  @ContentChild('emptyTemplate') emptyTemplate?: TemplateRef<any>;
  
  /** Page change event */
  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  
  /** Sort change event */
  @Output() sortChange = new EventEmitter<SortDescriptor[]>();
  
  /** Selection change event */
  @Output() selectionChange = new EventEmitter<any>();
  
  get gridData(): any {
    if (this.total !== undefined) {
      // Server-side pagination
      return {
        data: this.data,
        total: this.total
      };
    }
    // Client-side pagination
    return this.data;
  }
  
  onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageChange.emit(event);
  }
  
  onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.sortChange.emit(sort);
  }
  
  onSelectionChange(event: any): void {
    this.selectionChange.emit(event);
  }
}
