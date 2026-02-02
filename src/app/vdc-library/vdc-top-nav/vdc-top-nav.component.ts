import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { NavigationModule, BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { VdcSideNavService } from '../vdc-side-nav/vdc-side-nav.service';

/**
 * Breadcrumb item interface extending Kendo's BreadCrumbItem
 */
export interface VdcBreadcrumbItem extends BreadCrumbItem {
  id?: string;
  route?: string;
}

/**
 * VDC Top Navigation Component
 * Includes breadcrumbs, panel collapse button, and release search
 */
@Component({
  selector: 'vdc-top-nav',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonsModule,
    InputsModule,
    NavigationModule,
    TooltipModule,
  ],
  template: `
    <header class="vdc-top-nav">
      <!-- Left Section: Collapse Button + Breadcrumbs -->
      <div class="vdc-top-nav__left">
        <!-- Panel Collapse/Expand Button -->
        <button
          kendoButton
          look="flat"
          class="vdc-top-nav__collapse-btn"
          [title]="navService.isPanelExpanded() ? 'Collapse navigation' : 'Expand navigation'"
          kendoTooltip
          [position]="'bottom'"
          (click)="navService.togglePanelExpansion()"
        >
          <i [class]="navService.isPanelExpanded() ? 'fa-regular fa-angles-left' : 'fa-regular fa-angles-right'"></i>
        </button>

        <!-- Breadcrumbs -->
        <kendo-breadcrumb
          [items]="breadcrumbItems()"
          class="vdc-top-nav__breadcrumb"
          (itemClick)="onBreadcrumbClick($event)"
        >
          <ng-template kendoBreadCrumbSeparatorTemplate>
            <span class="vdc-breadcrumb-separator">/</span>
          </ng-template>
        </kendo-breadcrumb>
      </div>

      <!-- Right Section: Release Search -->
      <div class="vdc-top-nav__right">
        <kendo-textbox
          [(ngModel)]="releaseSearchTerm"
          placeholder="Search release by ID..."
          [clearButton]="true"
          class="vdc-top-nav__search"
          (keydown.enter)="onReleaseSearch()"
        >
          <ng-template kendoTextBoxSuffixTemplate>
            <button
              kendoButton
              look="flat"
              class="vdc-top-nav__search-btn"
              title="Search"
              (click)="onReleaseSearch()"
            >
              <i class="fa-regular fa-search"></i>
            </button>
          </ng-template>
        </kendo-textbox>
      </div>
    </header>
  `,
  styles: [`
    .vdc-top-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 var(--vdc-space-md);
      background-color: var(--vdc-surface-100);
      border-bottom: 1px solid var(--vdc-border-subtle);
    }

    .vdc-top-nav__left {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
    }

    /* Kendo Button override for collapse button */
    :host ::ng-deep .vdc-top-nav__collapse-btn.k-button {
      width: 28px;
      height: 28px;
      min-width: 28px;
      padding: 0;
      border: none;
      border-radius: var(--vdc-radius-sm);
      background-color: transparent;
      color: var(--vdc-primary);
      transition: all 0.15s ease;
      // Focus ring handled by global _kendo-fluent-overrides.scss

      &:hover,
      &:focus {
        background-color: color-mix(in srgb, var(--vdc-primary) 10%, transparent);
        color: var(--vdc-primary);
      }

      i {
        font-size: 14px;
      }
    }

    /* Kendo Breadcrumb overrides */
    :host ::ng-deep .vdc-top-nav__breadcrumb {
      .k-breadcrumb {
        font-family: var(--vdc-font-family);
        background: transparent;
        padding: 0;
      }

      .k-breadcrumb-item {
        font-size: var(--vdc-font-size-md);
      }

      .k-breadcrumb-link {
        color: var(--vdc-text-secondary);
        text-decoration: none;
        padding: var(--vdc-space-xs) var(--vdc-space-sm);
        border-radius: var(--vdc-radius-sm);
        transition: all 0.15s ease;

        &:hover {
          color: var(--vdc-text-primary);
          background-color: var(--vdc-surface-300);
        }
      }

      .k-breadcrumb-last-item .k-breadcrumb-link {
        color: var(--vdc-text-primary);
        font-weight: var(--vdc-font-weight-semibold);
        cursor: default;

        &:hover {
          background: transparent;
        }
      }

      .k-breadcrumb-delimiter {
        display: none; /* Hide default delimiter container if needed, but template usually replaces it */
      }

      .vdc-breadcrumb-separator {
        color: var(--vdc-text-disabled);
        font-size: var(--vdc-font-size-md);
        margin: 0 4px;
        user-select: none;
      }
    }

    .vdc-top-nav__right {
      display: flex;
      align-items: center;
    }

    /* Kendo TextBox override for release search */
    :host ::ng-deep .vdc-top-nav__search.k-textbox {
      width: 280px;
      font-family: var(--vdc-font-family);
    }

    .vdc-top-nav__search-icon {
      color: var(--vdc-entity-release, var(--vdc-text-secondary));
      font-size: 14px;
      margin-left: var(--vdc-space-xs);
    }

    /* Kendo Button override for search button */
    :host ::ng-deep .vdc-top-nav__search-btn.k-button {
      width: 28px;
      height: 28px;
      min-width: 28px;
      padding: 0;
      border: none;
      border-radius: var(--vdc-radius-sm);
      background-color: transparent;
      color: var(--vdc-text-secondary);
      margin-right: var(--vdc-space-xs);
      // Focus ring handled by global _kendo-fluent-overrides.scss

      &:hover,
      &:focus {
        background-color: var(--vdc-surface-300);
        color: var(--vdc-text-primary);
      }

      i {
        font-size: 14px;
      }
    }
  `],
})
export class VdcTopNavComponent {
  protected readonly navService = inject(VdcSideNavService);

  // -------------------------------------------------------------------------
  // Inputs
  // -------------------------------------------------------------------------

  /** Breadcrumb items to display */
  breadcrumbItems = input<VdcBreadcrumbItem[]>([
    { text: 'VDC', title: 'Home' },
    { text: 'Global Explorer', title: 'Global Explorer' },
    { text: 'Project Explorer', title: 'Project Explorer' },
  ]);

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  /** Emitted when a breadcrumb item is clicked */
  breadcrumbClick = output<VdcBreadcrumbItem>();

  /** Emitted when release search is triggered */
  releaseSearch = output<string>();

  // -------------------------------------------------------------------------
  // Local State
  // -------------------------------------------------------------------------

  releaseSearchTerm = '';

  // -------------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------------

  onBreadcrumbClick(item: BreadCrumbItem): void {
    this.breadcrumbClick.emit(item as VdcBreadcrumbItem);
  }

  onReleaseSearch(): void {
    if (this.releaseSearchTerm.trim()) {
      this.releaseSearch.emit(this.releaseSearchTerm.trim());
    }
  }
}
