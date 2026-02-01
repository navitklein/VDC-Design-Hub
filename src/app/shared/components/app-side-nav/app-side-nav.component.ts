import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { filter } from 'rxjs/operators';

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  color: string;
  children: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
}

/**
 * App Side Navigation Component
 * 2-tier navigation with icon rail (tier 1) and content panel (tier 2)
 * Following the VdcSideNav design pattern
 */
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ButtonsModule, InputsModule, TooltipModule],
  template: `
    <aside class="app-side-nav">
      <!-- Tier 1: Icon Rail -->
      <nav class="app-side-nav__rail" [style.--rail-color]="getActiveColor()">
        <!-- Logo -->
        <div class="app-side-nav__logo">
          <a routerLink="/">
            <img src="/vdc-logo-white.svg" alt="VDC" />
          </a>
        </div>

        <!-- Section Icons -->
        <div class="app-side-nav__sections">
          @for (section of navSections; track section.id) {
            <button
              kendoButton
              look="flat"
              class="app-side-nav__section-btn"
              [class.app-side-nav__section-btn--active]="activeSection() === section.id"
              [title]="section.label"
              kendoTooltip
              [position]="'right'"
              (click)="onSectionClick(section.id)"
            >
              <i [class]="section.icon"></i>
            </button>
          }
        </div>

        <!-- Bottom Utilities -->
        <div class="app-side-nav__utilities">
          <button
            kendoButton
            look="flat"
            rounded="full"
            class="app-side-nav__utility-btn"
            title="Help"
            kendoTooltip
            [position]="'right'"
          >
            <i class="fa-regular fa-circle-question"></i>
          </button>
        </div>
      </nav>

      <!-- Tier 2: Content Panel -->
      <div class="app-side-nav__panel" [style.--panel-color]="getActiveColor()">
        <!-- Panel Header -->
        <header class="app-side-nav__panel-header">
          <h2 class="app-side-nav__panel-title">{{ getActiveSectionLabel() }}</h2>
        </header>

        <!-- Search -->
        <div class="app-side-nav__search">
          <kendo-textbox
            [(ngModel)]="searchQuery"
            placeholder="Search..."
            [clearButton]="true"
            class="app-side-nav__search-input"
          >
            <ng-template kendoTextBoxPrefixTemplate>
              <i class="fa-regular fa-search app-side-nav__search-icon"></i>
            </ng-template>
          </kendo-textbox>
        </div>

        <!-- Nav Items -->
        <div class="app-side-nav__panel-content">
          <ul class="app-side-nav__item-list">
            @for (item of filteredItems(); track item.id) {
              <li>
                <a
                  [routerLink]="item.route"
                  routerLinkActive="app-side-nav__item--active"
                  class="app-side-nav__item"
                >
                  @if (item.icon) {
                    <i [class]="item.icon + ' app-side-nav__item-icon'"></i>
                  }
                  <span class="app-side-nav__item-label">{{ item.label }}</span>
                </a>
              </li>
            }
            @if (filteredItems().length === 0) {
              <li class="app-side-nav__no-results">No results found</li>
            }
          </ul>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .app-side-nav {
      display: flex;
      height: 100vh;
      font-family: var(--vdc-font-family);
    }

    /* ========== Tier 1: Icon Rail ========== */
    .app-side-nav__rail {
      display: flex;
      flex-direction: column;
      width: 56px;
      background-color: var(--rail-color, #0f6cbd);
      padding: var(--vdc-space-sm) 0;
      transition: background-color 0.2s ease;
    }

    .app-side-nav__logo {
      display: flex;
      justify-content: center;
      padding: var(--vdc-space-sm) 0 var(--vdc-space-lg);

      a {
        display: block;
      }

      img {
        width: 32px;
        height: 32px;
      }
    }

    .app-side-nav__sections {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-xs);
      padding: 0 var(--vdc-space-sm);
    }

    /* Kendo Button overrides for section buttons */
    :host ::ng-deep .app-side-nav__section-btn.k-button {
      width: 40px;
      height: 40px;
      min-width: 40px;
      padding: 0;
      border: none;
      border-radius: var(--vdc-radius-md);
      background-color: transparent;
      color: rgba(255, 255, 255, 0.4);
      transition: all 0.15s ease;

      &:hover,
      &:focus {
        background-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
      }

      &.app-side-nav__section-btn--active {
        background-color: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 1);

        &:hover,
        &:focus {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }

      i {
        font-size: 18px;
      }
    }

    .app-side-nav__utilities {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--vdc-space-sm);
      padding: var(--vdc-space-md) var(--vdc-space-sm);
    }

    :host ::ng-deep .app-side-nav__utility-btn.k-button {
      width: 36px;
      height: 36px;
      min-width: 36px;
      padding: 0;
      border: none;
      border-radius: var(--vdc-radius-full);
      background-color: transparent;
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.15s ease;

      &:hover,
      &:focus {
        background-color: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 1);
      }

      i {
        font-size: 16px;
      }
    }

    /* ========== Tier 2: Content Panel ========== */
    .app-side-nav__panel {
      display: flex;
      flex-direction: column;
      width: 240px;
      background-color: var(--vdc-surface-100);
      border-right: 1px solid var(--vdc-border-subtle);
      overflow: hidden;
    }

    .app-side-nav__panel-header {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 var(--vdc-space-lg);
      border-bottom: 2px solid var(--panel-color, #0f6cbd);
    }

    .app-side-nav__panel-title {
      margin: 0;
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--panel-color, #0f6cbd);
    }

    /* ========== Search ========== */
    .app-side-nav__search {
      padding: var(--vdc-space-md);
    }

    :host ::ng-deep .app-side-nav__search-input.k-textbox {
      width: 100%;
    }

    .app-side-nav__search-icon {
      color: var(--vdc-text-secondary);
      font-size: 14px;
      margin-left: var(--vdc-space-xs);
    }

    /* ========== Panel Content ========== */
    .app-side-nav__panel-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0;
    }

    .app-side-nav__item-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .app-side-nav__item {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
      width: 100%;
      padding: 10px var(--vdc-space-lg);
      border: none;
      border-left: 3px solid transparent;
      background: transparent;
      color: var(--vdc-text-primary);
      font-size: var(--vdc-font-size-sm);
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;

      &:hover {
        background-color: var(--vdc-surface-200);
      }

      &.app-side-nav__item--active {
        border-left-color: var(--panel-color, #0f6cbd);
        background-color: color-mix(in srgb, var(--panel-color, #0f6cbd) 12%, transparent);
        color: var(--panel-color, #0f6cbd);

        .app-side-nav__item-icon {
          color: var(--panel-color, #0f6cbd);
        }
      }
    }

    .app-side-nav__item-icon {
      font-size: 14px;
      color: var(--vdc-text-secondary);
      width: 16px;
      text-align: center;
    }

    .app-side-nav__item-label {
      flex: 1;
    }

    .app-side-nav__no-results {
      padding: var(--vdc-space-lg);
      text-align: center;
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-sm);
    }
  `]
})
export class AppSideNavComponent {
  private readonly router = inject(Router);

  // Navigation configuration
  readonly navSections: NavSection[] = [
    {
      id: 'mockups',
      label: 'Mockups',
      icon: 'fa-regular fa-window-restore',
      color: '#0f6cbd',
      children: [
        { id: 'side-nav-demo', label: 'Side Nav Demo', route: '/mockups/side-nav-demo/identity' },
        { id: 'personal-workspace', label: 'Personal Workspace', route: '/mockups/personal-workspace/identity' }
      ]
    },
    {
      id: 'style-guide',
      label: 'Style Guide',
      icon: 'fa-regular fa-swatchbook',
      color: '#0f6cbd',
      children: [
        { id: 'palettes', label: 'Palettes', route: '/style-guide/palettes', icon: 'fa-regular fa-palette' },
        { id: 'semantic', label: 'Semantic Colors', route: '/style-guide/semantic', icon: 'fa-regular fa-droplet' },
        { id: 'vdc-colors', label: 'VDC Colors', route: '/style-guide/vdc-colors', icon: 'fa-regular fa-brush' },
        { id: 'guidelines', label: 'Usage Guidelines', route: '/style-guide/guidelines', icon: 'fa-regular fa-book' }
      ]
    },
    {
      id: 'components',
      label: 'Components',
      icon: 'fa-regular fa-cubes',
      color: '#0f6cbd',
      children: [
        { id: 'overview', label: 'Overview', route: '/components/overview', icon: 'fa-regular fa-grid-2' },
        { id: 'vdc-breadcrumbs', label: 'VdcBreadcrumbs', route: '/components/vdc-breadcrumbs', icon: 'fa-regular fa-ellipsis' },
        { id: 'vdc-button', label: 'VdcButton', route: '/components/vdc-button', icon: 'fa-regular fa-square' },
        { id: 'vdc-dropdown', label: 'VdcDropdown', route: '/components/vdc-dropdown', icon: 'fa-regular fa-caret-down' },
        { id: 'vdc-grid', label: 'VdcGrid', route: '/components/vdc-grid', icon: 'fa-regular fa-table' },
        { id: 'vdc-side-nav', label: 'VdcSideNav', route: '/components/vdc-side-nav', icon: 'fa-regular fa-sidebar' },
        { id: 'vdc-top-nav', label: 'VdcTopNav', route: '/components/vdc-top-nav', icon: 'fa-regular fa-window-maximize' }
      ]
    },
    {
      id: 'icons',
      label: 'Icons',
      icon: 'fa-regular fa-icons',
      color: '#0f6cbd',
      children: [
        { id: 'vdc-entities', label: 'VDC Entities', route: '/icons/vdc-entities', icon: 'fa-regular fa-box' },
        { id: 'navigation', label: 'Navigation', route: '/icons/navigation', icon: 'fa-regular fa-compass' },
        { id: 'vdc-actions', label: 'VDC Actions', route: '/icons/vdc-actions', icon: 'fa-regular fa-bolt' },
        { id: 'status', label: 'Status', route: '/icons/status', icon: 'fa-regular fa-circle-check' },
        { id: 'other', label: 'Other', route: '/icons/other', icon: 'fa-regular fa-ellipsis' }
      ]
    }
  ];

  // State
  readonly activeSection = signal<string>('style-guide');
  searchQuery = '';

  // Computed
  readonly currentChildren = computed(() => {
    const section = this.navSections.find(s => s.id === this.activeSection());
    return section?.children || [];
  });

  readonly filteredItems = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    const children = this.currentChildren();
    
    if (!query) return children;
    
    return children.filter(item => 
      item.label.toLowerCase().includes(query)
    );
  });

  constructor() {
    // Track active section based on current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveSection(event.urlAfterRedirects);
    });

    // Set initial state based on current URL
    this.updateActiveSection(this.router.url);
  }

  private updateActiveSection(url: string): void {
    for (const section of this.navSections) {
      if (section.children.some(child => url.startsWith(child.route.split('/').slice(0, 3).join('/')))) {
        this.activeSection.set(section.id);
        return;
      }
    }
  }

  onSectionClick(sectionId: string): void {
    this.activeSection.set(sectionId);
    this.searchQuery = ''; // Clear search when switching sections
    
    // Navigate to first item in section
    const section = this.navSections.find(s => s.id === sectionId);
    if (section && section.children.length > 0) {
      this.router.navigate([section.children[0].route]);
    }
  }

  getActiveColor(): string {
    const section = this.navSections.find(s => s.id === this.activeSection());
    return section?.color || '#0f6cbd';
  }

  getActiveSectionLabel(): string {
    const section = this.navSections.find(s => s.id === this.activeSection());
    return section?.label || '';
  }
}
