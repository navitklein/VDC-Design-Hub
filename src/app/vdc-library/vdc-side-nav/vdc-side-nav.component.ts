import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { VdcSideNavService } from './vdc-side-nav.service';
import {
  NavContext,
  NavContextType,
  NavSection,
  NavItem,
  NavProject,
} from './vdc-side-nav.models';

/**
 * VDC Side Navigation Component
 * 2-tier navigation with icon rail and content panel
 */
@Component({
  selector: 'vdc-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonsModule,
    InputsModule,
    TooltipModule,
  ],
  template: `
    <aside class="vdc-side-nav">
      <!-- Tier 1: Icon Rail -->
      <nav 
        class="vdc-side-nav__rail"
        [style.--rail-color]="getActiveContextColor()"
      >
        <!-- Logo (white variant for dark background) -->
        <div class="vdc-side-nav__logo">
          <img src="/vdc-logo-white.svg" alt="VDC" class="vdc-side-nav__logo-img" />
        </div>

        <!-- Context Icons -->
        <div class="vdc-side-nav__contexts">
          @for (context of contexts(); track context.id) {
            <button
              kendoButton
              look="flat"
              class="vdc-side-nav__context-btn"
              [class.vdc-side-nav__context-btn--active]="navService.activeContext() === context.id"
              [class.vdc-side-nav__context-btn--has-project]="context.id === 'project' && navService.selectedProject()"
              [style.--context-color]="context.colorToken"
              [attr.aria-label]="context.id === 'project' && navService.selectedProject() ? navService.selectedProject()!.name : context.label"
              [title]="context.id === 'project' && navService.selectedProject() ? navService.selectedProject()!.name : context.label"
              kendoTooltip
              [position]="'right'"
              (click)="onContextClick(context.id)"
            >
              @if (context.id === 'project' && navService.selectedProject()) {
                <span class="vdc-side-nav__project-initials">{{ getProjectInitials(navService.selectedProject()!) }}</span>
              } @else {
                <i [class]="'fa-regular ' + context.icon"></i>
              }
            </button>
          }
        </div>

        <!-- Bottom Utilities -->
        <div class="vdc-side-nav__utilities">
          <!-- Help -->
          <button 
            kendoButton
            look="flat"
            rounded="full"
            class="vdc-side-nav__utility-btn"
            title="Help"
            kendoTooltip
            [position]="'right'"
            (click)="onHelpClick()"
          >
            <i class="fa-regular fa-circle-question"></i>
          </button>

          <!-- Theme Toggle -->
          <button 
            kendoButton
            look="flat"
            rounded="full"
            class="vdc-side-nav__utility-btn"
            [title]="navService.theme() === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
            kendoTooltip
            [position]="'right'"
            (click)="navService.toggleTheme()"
          >
            <i [class]="navService.theme() === 'light' ? 'fa-regular fa-brightness' : 'fa-regular fa-moon'"></i>
          </button>

          <!-- User Profile (at bottom) -->
          <button 
            kendoButton
            look="flat"
            rounded="full"
            class="vdc-side-nav__utility-btn vdc-side-nav__profile-btn"
            [title]="navService.userProfile().name"
            kendoTooltip
            [position]="'right'"
          >
            <img 
              [src]="navService.userProfile().avatarUrl || 'https://i.pravatar.cc/150?img=68'" 
              [alt]="navService.userProfile().name"
              class="vdc-side-nav__avatar"
            />
          </button>
        </div>
      </nav>

      <!-- Tier 2: Content Panel -->
      @if (navService.isPanelExpanded()) {
        <div 
          class="vdc-side-nav__panel"
          [style.--panel-color]="getActiveContextColor()"
        >
        <!-- Panel Header -->
        <header class="vdc-side-nav__panel-header">
          @if (navService.isInProjectContext()) {
            <h2 class="vdc-side-nav__panel-title">
              {{ navService.selectedProject()?.name }}
            </h2>
          } @else {
            <h2 class="vdc-side-nav__panel-title">
              {{ getActiveContextTitle() }}
            </h2>
          }
        </header>

        <!-- Panel Content -->
        <div class="vdc-side-nav__panel-content">
          @if (navService.isInProjectContext()) {
            <div class="vdc-side-nav__switch-project">
              <button 
                kendoButton
                look="flat"
                class="vdc-side-nav__switch-project-btn"
                (click)="navService.clearSelectedProject()"
              >
                <i class="fa-regular fa-arrow-left"></i>
                Switch project
              </button>
            </div>
          }
          @switch (navService.activeContext()) {
            @case ('global') {
              <ng-container *ngTemplateOutlet="sectionList; context: { sections: getGlobalSections() }"></ng-container>
            }
            @case ('personal') {
              <ng-container *ngTemplateOutlet="sectionList; context: { sections: getPersonalSections() }"></ng-container>
            }
            @case ('project') {
              @if (navService.isShowingProjectBrowser()) {
                <!-- Project Browser -->
                <div class="vdc-side-nav__search">
                  <kendo-textbox
                    [(ngModel)]="projectSearchTerm"
                    placeholder="Find project..."
                    [clearButton]="true"
                    class="vdc-side-nav__search-input"
                  >
                    <ng-template kendoTextBoxPrefixTemplate>
                      <i class="fa-regular fa-search vdc-side-nav__search-icon"></i>
                    </ng-template>
                  </kendo-textbox>
                </div>

                @if (navService.isSwitchingProject()) {
                  <div class="vdc-side-nav__cancel-switch">
                    <button
                      kendoButton
                      look="flat"
                      class="vdc-side-nav__cancel-switch-btn"
                      (click)="onCancelProjectSwitch()"
                    >
                      <i class="fa-regular fa-xmark"></i>
                      Cancel switch
                    </button>
                  </div>
                }

                <!-- Filter Pills -->
                <div class="vdc-side-nav__filters">
                  <button
                    kendoButton
                    look="flat"
                    class="vdc-side-nav__filter-pill"
                    [class.vdc-side-nav__filter-pill--active]="showMyProjectsOnly"
                    (click)="showMyProjectsOnly = !showMyProjectsOnly"
                  >
                    My Projects ({{ getMyProjectsCount() }})
                  </button>
                </div>

                <div class="vdc-side-nav__section">
                  <ul class="vdc-side-nav__project-list">
                    @for (project of filteredProjects(); track project.id) {
                      <li>
                        <button
                          kendoButton
                          look="flat"
                          class="vdc-side-nav__project-item"
                          (click)="onProjectSelect(project)"
                        >
                          <span class="vdc-side-nav__project-name">{{ project.name }}</span>
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              } @else {
                <!-- Project Context -->
                <ng-container *ngTemplateOutlet="sectionList; context: { sections: projectContextSections() }"></ng-container>
              }
            }
          }
        </div>
      </div>
      }

      <!-- Section List Template -->
      <ng-template #sectionList let-sections="sections">
        @for (section of sections; track section.id) {
          <div class="vdc-side-nav__section">
            @if (section.label) {
              <h3 class="vdc-side-nav__section-label">{{ section.label }}</h3>
            }
            <ul class="vdc-side-nav__item-list">
              @for (item of section.items; track item.id) {
                <li>
                  <button
                    kendoButton
                    look="flat"
                    class="vdc-side-nav__item"
                    [class.vdc-side-nav__item--active]="navService.activeItemId() === item.id"
                    [class.vdc-side-nav__item--disabled]="item.disabled"
                    [disabled]="item.disabled"
                    (click)="onItemClick(item)"
                  >
                    @if (item.icon) {
                      <i [class]="'fa-regular ' + item.icon + ' vdc-side-nav__item-icon'"></i>
                    }
                    <span class="vdc-side-nav__item-label">{{ item.label }}</span>
                  </button>
                </li>
              }
            </ul>
          </div>
        }
      </ng-template>
    </aside>
  `,
  styles: [`
    .vdc-side-nav {
      display: flex;
      height: 100%;
      font-family: var(--vdc-font-family);
    }

    /* ========== Tier 1: Icon Rail ========== */
    .vdc-side-nav__rail {
      display: flex;
      flex-direction: column;
      width: 56px;
      background-color: var(--rail-color);
      border-right: none;
      padding: var(--vdc-space-sm) 0;
      transition: background-color 0.2s ease;
    }

    .vdc-side-nav__logo {
      display: flex;
      justify-content: center;
      padding: var(--vdc-space-sm) 0 var(--vdc-space-md);
    }

    .vdc-side-nav__logo-img {
      width: 32px;
      height: 32px;
    }

    .vdc-side-nav__contexts {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-xs);
      padding: 0 var(--vdc-space-sm);
    }

    /* Kendo Button overrides for context buttons */
    :host ::ng-deep .vdc-side-nav__context-btn.k-button {
      width: 40px;
      height: 40px;
      min-width: 40px;
      padding: 0;
      border: none;
      border-radius: var(--vdc-radius-md);
      background-color: transparent;
      color: rgba(255, 255, 255, 0.4);
      transition: all 0.15s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
      }

      &:focus {
        background-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
      }

      &.vdc-side-nav__context-btn--active {
        background-color: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 1);

        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        &:focus {
          background-color: rgba(255, 255, 255, 0.2);
          outline: 2px solid rgba(255, 255, 255, 0.5);
          outline-offset: 2px;
        }
      }

      i {
        font-size: 18px;
      }
    }

    .vdc-side-nav__project-initials {
      font-size: 11px;
      font-weight: var(--vdc-font-weight-bold);
      color: inherit;
      letter-spacing: -0.5px;
    }

    .vdc-side-nav__utilities {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--vdc-space-sm);
      padding: var(--vdc-space-md) var(--vdc-space-sm);
    }

    /* Kendo Button overrides for utility buttons */
    :host ::ng-deep .vdc-side-nav__utility-btn.k-button {
      width: 36px;
      height: 36px;
      min-width: 36px;
      padding: 0;
      border: none;
      border-radius: var(--vdc-radius-full);
      background-color: transparent;
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.15s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 1);
      }

      &:focus {
        background-color: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 1);
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
      }

      i {
        font-size: 16px;
      }
    }

    :host ::ng-deep .vdc-side-nav__profile-btn.k-button {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .vdc-side-nav__avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--vdc-radius-full);
      object-fit: cover;
    }

    .vdc-side-nav__avatar-initials {
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-semibold);
      color: rgba(255, 255, 255, 1);
    }

    /* ========== Tier 2: Content Panel ========== */
    .vdc-side-nav__panel {
      display: flex;
      flex-direction: column;
      width: 240px;
      background-color: var(--vdc-surface-100);
      border-right: 1px solid var(--vdc-border-subtle);
      overflow: hidden;
      animation: slideIn 0.2s ease-out;
    }

    @keyframes slideIn {
      from {
        width: 0;
        opacity: 0;
      }
      to {
        width: 240px;
        opacity: 1;
      }
    }

    .vdc-side-nav__panel-header {
      display: flex;
      align-items: center;
      height: 48px;
      padding: 0 var(--vdc-space-lg);
      border-bottom: 2px solid var(--panel-color);
    }

    .vdc-side-nav__panel-title {
      margin: 0;
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-semibold, 600);
      color: var(--panel-color);
    }

    /* Switch project wrapper */
    .vdc-side-nav__switch-project {
      padding: 0 var(--vdc-space-lg) var(--vdc-space-md);
    }

    /* Kendo Button override for switch project button - link style */
    :host ::ng-deep .vdc-side-nav__switch-project-btn.k-button {
      display: inline-flex;
      align-items: center;
      gap: var(--vdc-space-xs);
      padding: var(--vdc-space-xs) 0;
      border: none;
      background: transparent;
      color: var(--vdc-primary);
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-regular, 400);
      text-decoration: none;
      transition: all 0.15s ease;
      // Focus ring handled by global _kendo-fluent-overrides.scss

      &:hover,
      &:focus {
        color: var(--vdc-primary-dark, #0056b3);
        background: transparent;
        text-decoration: underline;
      }

      i {
        font-size: 12px;
      }
    }

    .vdc-side-nav__panel-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--vdc-space-md) 0;
    }

    /* ========== Search (Kendo TextBox) ========== */
    .vdc-side-nav__search {
      padding: 0 var(--vdc-space-md) var(--vdc-space-md);
    }

    :host ::ng-deep .vdc-side-nav__search-input.k-textbox {
      width: 100%;
      font-family: var(--vdc-font-family);
    }

    .vdc-side-nav__search-icon {
      color: var(--vdc-text-secondary);
      font-size: 14px;
      margin-left: var(--vdc-space-xs);
    }

    /* ========== Filter Pills ========== */
    .vdc-side-nav__filters {
      display: flex;
      gap: var(--vdc-space-xs);
      padding: 0 var(--vdc-space-md) var(--vdc-space-md);
    }

    :host ::ng-deep .vdc-side-nav__filter-pill.k-button {
      display: inline-flex !important;
      align-items: center;
      gap: 6px;
      padding: 4px 10px !important;
      font-size: var(--vdc-font-size-xs);
      font-weight: var(--vdc-font-weight-medium, 500);
      border-radius: 16px !important;
      border: 1px solid #c0c0c0 !important;
      background: transparent !important;
      color: var(--vdc-text-secondary);
      transition: all 0.15s ease;
      // Focus ring handled by global _kendo-fluent-overrides.scss

      &:hover,
      &:focus {
        border-color: var(--panel-color) !important;
        color: var(--panel-color);
        background: transparent !important;
      }

      &.vdc-side-nav__filter-pill--active,
      &.vdc-side-nav__filter-pill--active:hover,
      &.vdc-side-nav__filter-pill--active:focus {
        background-color: var(--panel-color) !important;
        border-color: var(--panel-color) !important;
        color: white !important;
      }
    }

    /* ========== Sections ========== */
    .vdc-side-nav__section {
      margin-bottom: var(--vdc-space-lg);
    }

    .vdc-side-nav__section-label {
      margin: 0 0 var(--vdc-space-xs);
      padding: 0 var(--vdc-space-lg);
      font-size: var(--vdc-font-size-xs);
      font-weight: var(--vdc-font-weight-regular, 400);
      color: var(--vdc-text-tertiary, #a0a0a0);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ========== Item List ========== */
    .vdc-side-nav__item-list,
    .vdc-side-nav__project-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    /* Kendo Button override for navigation items */
    :host ::ng-deep .vdc-side-nav__item.k-button {
      display: flex !important;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 10px var(--vdc-space-lg);
      border: none;
      border-left: 3px solid transparent;
      border-radius: 0;
      background: transparent;
      color: var(--vdc-text-primary);
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-regular, 400);
      text-align: left;
      transition: all 0.15s ease;
      // Focus ring handled by global _kendo-fluent-overrides.scss

      .k-button-text {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      &:hover,
      &:focus {
        background-color: var(--vdc-surface-300);
      }

      &.vdc-side-nav__item--active {
        background-color: color-mix(in srgb, var(--panel-color) 12%, white) !important;
        border-left-color: var(--panel-color);
        color: var(--panel-color);

        .vdc-side-nav__item-icon {
          color: var(--panel-color);
        }

        &:hover,
        &:focus {
          background-color: color-mix(in srgb, var(--panel-color) 18%, white) !important;
        }
      }

      &.vdc-side-nav__item--disabled {
        color: var(--vdc-text-disabled);
        cursor: not-allowed;

        &:hover,
        &:focus {
          background: transparent;
        }
      }
    }

    .vdc-side-nav__item-icon {
      font-size: 16px;
      color: var(--vdc-text-secondary);
      width: 18px;
      text-align: center;
      flex-shrink: 0;
    }

    .vdc-side-nav__item-indicator {
      font-size: 12px;
    }

    /* ========== Project List (Kendo Button override) ========== */
    :host ::ng-deep .vdc-side-nav__project-item.k-button {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: var(--vdc-space-sm) var(--vdc-space-lg);
      border: none;
      border-radius: 0;
      background: transparent;
      text-align: left;
      transition: background-color 0.15s ease;
      // Focus ring handled by global _kendo-fluent-overrides.scss

      &:hover,
      &:focus {
        background-color: var(--vdc-surface-300);
      }
    }

    .vdc-side-nav__project-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .vdc-side-nav__project-name {
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
    }

    .vdc-side-nav__project-meta {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
    }

    .vdc-side-nav__project-code {
      font-size: var(--vdc-font-size-xs);
      font-family: 'Consolas', 'Monaco', monospace;
      color: var(--vdc-text-secondary);
      background-color: var(--vdc-surface-300);
      padding: 1px 6px;
      border-radius: var(--vdc-radius-sm);
    }

    .vdc-side-nav__project-time {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
    }

    /* ========== Cancel Switch ========== */
    .vdc-side-nav__cancel-switch {
      padding: 0 var(--vdc-space-lg) var(--vdc-space-md);
    }

    :host ::ng-deep .vdc-side-nav__cancel-switch-btn.k-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--vdc-space-xs);
      width: 100%;
      padding: var(--vdc-space-sm) var(--vdc-space-md);
      border: 1px solid var(--vdc-border-default);
      border-radius: var(--vdc-radius-md);
      background: transparent;
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-sm);
      transition: all 0.15s ease;
      // Focus ring handled by global _kendo-fluent-overrides.scss

      &:hover,
      &:focus {
        background-color: var(--vdc-surface-300);
        color: var(--vdc-text-primary);
        border-color: var(--vdc-border-default);
      }

      i {
        font-size: 12px;
      }
    }
  `],
})
export class VdcSideNavComponent {
  protected readonly navService = inject(VdcSideNavService);

  // -------------------------------------------------------------------------
  // Inputs
  // -------------------------------------------------------------------------

  /** Navigation contexts configuration */
  contexts = input<NavContext[]>([
    {
      id: 'global',
      label: 'Global Explorer',
      icon: 'fa-globe',  // fa-regular fa-globe from VDC icons
      colorToken: 'var(--vdc-context-global)',
      panelTitle: 'Global Explorer',
    },
    {
      id: 'personal',
      label: 'My Workspace',
      icon: 'fa-circle-user',  // fa-regular fa-circle-user from VDC icons
      colorToken: 'var(--vdc-context-personal)',
      panelTitle: 'My Workspace',
    },
    {
      id: 'project',
      label: 'Project',
      icon: 'fa-layer-group',  // fa-regular fa-layer-group from VDC icons (Projects Navigation)
      colorToken: 'var(--vdc-context-project)',
      panelTitle: 'Project Browser',
    },
  ]);

  /** Global context sections */
  globalSections = input<NavSection[]>([
    {
      id: 'global-items',
      label: '',
      items: [
        { id: 'project-explorer', label: 'Project Explorer', route: '/project-explorer', icon: 'fa-layer-group' },
        { id: 'ingredient-index', label: 'Ingredient Index', route: '/ingredient-index', icon: 'fa-cube' },
      ],
    },
  ]);

  /** Personal context sections */
  personalSections = input<NavSection[]>([
    {
      id: 'activity',
      label: 'Activity',
      items: [
        { id: 'my-runs', label: 'My Runs', route: '/my-runs', icon: 'fa-circle-play' },
        { id: 'my-submissions', label: 'My Submissions', route: '/my-submissions', icon: 'fa-paper-plane' },
      ],
    },
    {
      id: 'my-assets',
      label: 'My Assets',
      items: [
        { id: 'my-ingredients', label: 'My Ingredients', route: '/my-ingredients', icon: 'fa-cube' },
        { id: 'my-releases', label: 'My Releases', route: '/my-releases', icon: 'fa-rocket-launch' },
        { id: 'my-workflows', label: 'My Workflows', route: '/my-workflows', icon: 'fa-arrow-progress' },
        { id: 'my-projects', label: 'My Projects', route: '/my-projects', icon: 'fa-layer-group' },
      ],
    },
  ]);

  /** Project context sections (when a project is selected) */
  projectContextSections = input<NavSection[]>([
    {
      id: 'assets',
      label: 'Assets',
      items: [
        { id: 'ingredients', label: 'Ingredients', route: '/ingredients', icon: 'fa-cube' },
        { id: 'releases', label: 'Releases', route: '/releases', icon: 'fa-rocket-launch' },
        { id: 'workflows', label: 'Workflows', route: '/workflows', icon: 'fa-arrow-progress' },
      ],
    },
  ]);

  /** Recent projects list */
  recentProjects = input<NavProject[]>([
    { id: '1', name: 'Meteor Lake-S', shortcode: 'MTL-S', lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '2', name: 'Lunar Lake-M', shortcode: 'LNL-M', lastAccessed: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { id: '3', name: 'Arrow Lake-H', shortcode: 'ARL-H', lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: '4', name: 'Panther Canyon', shortcode: 'PAC-S', lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: '5', name: 'Raptor Lake-S', shortcode: 'RPL-S', lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: '6', name: 'Alder Lake-P', shortcode: 'ADL-P', lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: '7', name: 'Tiger Lake-U', shortcode: 'TGL-U', lastAccessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { id: '8', name: 'Ice Lake-Y', shortcode: 'ICL-Y', lastAccessed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: '9', name: 'Cannon Lake', shortcode: 'CNL', lastAccessed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    { id: '10', name: 'Coffee Lake-S', shortcode: 'CFL-S', lastAccessed: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
    { id: '11', name: 'Kaby Lake-R', shortcode: 'KBL-R', lastAccessed: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
    { id: '12', name: 'Skylake-X', shortcode: 'SKL-X', lastAccessed: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  ]);

  // -------------------------------------------------------------------------
  // Outputs
  // -------------------------------------------------------------------------

  /** Emitted when a navigation item is clicked */
  itemClick = output<NavItem>();

  /** Emitted when a project is selected */
  projectSelect = output<NavProject>();

  /** Emitted when help button is clicked */
  helpClick = output<void>();

  // -------------------------------------------------------------------------
  // Local State
  // -------------------------------------------------------------------------

  projectSearchTerm = '';
  showMyProjectsOnly = false;

  // -------------------------------------------------------------------------
  // Computed Helpers
  // -------------------------------------------------------------------------

  getActiveContextColor(): string {
    const context = this.contexts().find(c => c.id === this.navService.activeContext());
    return context?.colorToken ?? 'var(--vdc-primary)';
  }

  getActiveContextTitle(): string {
    const context = this.contexts().find(c => c.id === this.navService.activeContext());
    return context?.panelTitle ?? '';
  }

  getGlobalSections(): NavSection[] {
    return this.globalSections();
  }

  getPersonalSections(): NavSection[] {
    return this.personalSections();
  }

  filteredProjects(): NavProject[] {
    let projects = this.recentProjects();
    
    // Filter to "My Projects" (simulated: first 4 projects are "owned")
    if (this.showMyProjectsOnly) {
      projects = projects.slice(0, 4);
    }
    
    // Filter by search term
    const searchTerm = this.projectSearchTerm.toLowerCase().trim();
    if (searchTerm) {
      projects = projects.filter(
        p => p.name.toLowerCase().includes(searchTerm) || 
             p.shortcode.toLowerCase().includes(searchTerm)
      );
    }
    
    return projects;
  }

  getMyProjectsCount(): number {
    // Simulated: first 4 projects are "owned"
    return Math.min(4, this.recentProjects().length);
  }

  formatTimeAgo(date: Date | string | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    }
    return `${diffHours}h ago`;
  }

  getProjectInitials(project: NavProject): string {
    // Use shortcode if available (e.g., "MTL-S" -> "MTL")
    if (project.shortcode) {
      const parts = project.shortcode.split('-');
      return parts[0].substring(0, 3).toUpperCase();
    }
    // Fallback to first letters of project name words
    return project.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();
  }

  // -------------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------------

  onContextClick(contextId: NavContextType): void {
    this.navService.setActiveContext(contextId);
  }

  onItemClick(item: NavItem): void {
    if (item.disabled) return;
    this.navService.setActiveItem(item.id);
    this.itemClick.emit(item);
  }

  onProjectSelect(project: NavProject): void {
    this.navService.selectProject(project);
    this.projectSelect.emit(project);
  }

  onHelpClick(): void {
    this.helpClick.emit();
  }

  onCancelProjectSwitch(): void {
    this.navService.cancelProjectSwitch();
  }
}
