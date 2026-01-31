import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  VdcSideNavComponent, 
  VdcSideNavService, 
  NavItem, 
  NavProject,
  VdcTopNavComponent,
  VdcBreadcrumbItem
} from '../../../../vdc-library';

/**
 * Side Navigation Demo - Showcases the VdcSideNavComponent
 * Demonstrates the 2-tier navigation with Global, Personal, and Project contexts
 */
@Component({
  selector: 'app-side-nav-demo-design',
  standalone: true,
  imports: [CommonModule, VdcSideNavComponent, VdcTopNavComponent],
  template: `
    <!-- Demo Container -->
    <div class="demo">
      <div class="demo__layout">
        <!-- Side Navigation -->
        <vdc-side-nav
          (itemClick)="onItemClick($event)"
          (projectSelect)="onProjectSelect($event)"
          (helpClick)="onHelpClick()"
        ></vdc-side-nav>

        <!-- Main Content Area with Top Nav -->
        <div class="demo__main-wrapper">
          <!-- Top Navigation Bar -->
          <vdc-top-nav
            [breadcrumbItems]="breadcrumbs()"
            (breadcrumbClick)="onBreadcrumbClick($event)"
            (releaseSearch)="onReleaseSearch($event)"
          ></vdc-top-nav>

          <!-- Main Content Area -->
          <main class="demo__main">
          <div class="demo__content">
            <header class="demo__header">
              <h1>VDC Side Navigation</h1>
              <p class="vdc-body">
                A 2-tier navigation system with three contexts: Global Explorer, My Workspace, and Project.
                Features collapsible panel, project switching, and entity-based icons.
              </p>
            </header>

            <section class="demo__info">
              <h2>Current State</h2>
              <div class="demo__state-grid">
                <div class="demo__state-item">
                  <span class="demo__state-label">Active Context:</span>
                  <span class="demo__state-value demo__state-value--context" 
                        [attr.data-context]="navService.activeContext()">
                    {{ navService.activeContext() | titlecase }}
                  </span>
                </div>
                <div class="demo__state-item">
                  <span class="demo__state-label">Selected Project:</span>
                  <span class="demo__state-value">
                    {{ navService.selectedProject()?.name || 'None' }}
                  </span>
                </div>
                <div class="demo__state-item">
                  <span class="demo__state-label">Active Item:</span>
                  <span class="demo__state-value">
                    {{ navService.activeItemId() || 'None' }}
                  </span>
                </div>
                <div class="demo__state-item">
                  <span class="demo__state-label">Theme:</span>
                  <span class="demo__state-value">
                    <i [class]="navService.theme() === 'light' ? 'fa-regular fa-brightness' : 'fa-regular fa-moon'"></i>
                    {{ navService.theme() | titlecase }}
                  </span>
                </div>
                <div class="demo__state-item">
                  <span class="demo__state-label">Panel Expanded:</span>
                  <span class="demo__state-value">
                    <i [class]="navService.isPanelExpanded() ? 'fa-regular fa-angles-left' : 'fa-regular fa-angles-right'"></i>
                    {{ navService.isPanelExpanded() ? 'Yes' : 'No' }}
                  </span>
                </div>
              </div>
            </section>

            <section class="demo__instructions">
              <h2>Navigation Contexts</h2>
              <ul class="demo__instruction-list">
                <li>
                  <i class="fa-regular fa-globe" style="color: var(--vdc-context-global);"></i>
                  <strong>Global Explorer:</strong> Browse Project Explorer and Ingredient Index
                </li>
                <li>
                  <i class="fa-regular fa-circle-user" style="color: var(--vdc-context-personal);"></i>
                  <strong>My Workspace:</strong> Access your runs, submissions, ingredients, releases, workflows, and projects
                </li>
                <li>
                  <i class="fa-regular fa-layer-group" style="color: var(--vdc-context-project);"></i>
                  <strong>Project:</strong> Select a project to view its assets (Ingredients, Releases, Workflows)
                </li>
              </ul>
            </section>

            <section class="demo__instructions">
              <h2>Features</h2>
              <ul class="demo__instruction-list">
                <li>
                  <i class="fa-regular fa-cube" style="color: var(--vdc-text-secondary);"></i>
                  <strong>Entity Icons:</strong> Each navigation item shows its entity icon (cube for ingredients, rocket for releases, etc.)
                </li>
                <li>
                  <i class="fa-regular fa-font" style="color: var(--vdc-text-secondary);"></i>
                  <strong>Project Initials:</strong> When a project is selected, its initials appear in the 1st tier rail
                </li>
                <li>
                  <i class="fa-regular fa-filter" style="color: var(--vdc-text-secondary);"></i>
                  <strong>My Projects Filter:</strong> Filter the project browser to show only your projects
                </li>
                <li>
                  <i class="fa-regular fa-arrow-left" style="color: var(--vdc-text-secondary);"></i>
                  <strong>Cancel Switch:</strong> When switching projects, cancel to return to the previous project
                </li>
              </ul>
            </section>

            @if (lastAction) {
              <section class="demo__log">
                <h2>Last Action</h2>
                <div class="demo__log-entry">
                  <i class="fa-solid fa-bolt"></i>
                  {{ lastAction }}
                </div>
              </section>
            }
          </div>
        </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo {
      min-height: 100vh;
      background-color: var(--vdc-surface-200);
    }

    .demo__loading {
      display: flex;
      gap: 1px;
      height: 100vh;
    }

    .demo__full-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    .demo__layout {
      display: flex;
      min-height: 100vh;
    }

    .demo__main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .demo__main {
      flex: 1;
      padding: var(--vdc-space-xl);
      padding-bottom: 100px; /* Space for simulator bar */
      overflow-y: auto;
    }

    .demo__content {
      max-width: 800px;
    }

    .demo__header {
      margin-bottom: var(--vdc-space-xl);

      h1 {
        margin: 0 0 var(--vdc-space-sm);
        font-size: var(--vdc-font-size-2xl);
        font-weight: var(--vdc-font-weight-bold);
        color: var(--vdc-text-primary);
      }

      p {
        margin: 0;
        color: var(--vdc-text-secondary);
      }
    }

    .demo__info,
    .demo__instructions,
    .demo__log {
      background-color: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      padding: var(--vdc-space-lg);
      margin-bottom: var(--vdc-space-lg);

      h2 {
        margin: 0 0 var(--vdc-space-md);
        font-size: var(--vdc-font-size-lg);
        font-weight: var(--vdc-font-weight-semibold);
        color: var(--vdc-text-primary);
      }
    }

    .demo__state-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--vdc-space-md);
    }

    .demo__state-item {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-xs);
    }

    .demo__state-label {
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
      font-weight: var(--vdc-font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .demo__state-value {
      font-size: var(--vdc-font-size-md);
      color: var(--vdc-text-primary);
      display: flex;
      align-items: center;
      gap: var(--vdc-space-xs);

      &--context[data-context="global"] {
        color: var(--vdc-context-global);
      }

      &--context[data-context="personal"] {
        color: var(--vdc-context-personal);
      }

      &--context[data-context="project"] {
        color: var(--vdc-context-project);
      }
    }

    .demo__instruction-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-sm);

      li {
        display: flex;
        align-items: flex-start;
        gap: var(--vdc-space-sm);
        font-size: var(--vdc-font-size-md);
        color: var(--vdc-text-primary);

        i {
          margin-top: 3px;
          font-size: 16px;
        }

        strong {
          font-weight: var(--vdc-font-weight-semibold);
        }
      }
    }

    .demo__log-entry {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
      padding: var(--vdc-space-md);
      background-color: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-md);
      color: var(--vdc-text-primary);
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: var(--vdc-font-size-sm);

      i {
        color: var(--vdc-warning);
      }
    }
  `],
})
export class SideNavDemoDesignComponent {
  protected readonly navService = inject(VdcSideNavService);

  lastAction = '';

  /** Context labels for breadcrumbs */
  private readonly contextLabels: Record<string, string> = {
    global: 'Global Explorer',
    personal: 'My Workspace',
    project: 'Projects',
  };

  /** Item labels for breadcrumbs */
  private readonly itemLabels: Record<string, string> = {
    // Global context
    'project-explorer': 'Project Explorer',
    'ingredient-index': 'Ingredient Index',
    // Personal context
    'my-runs': 'My Runs',
    'my-submissions': 'My Submissions',
    'my-ingredients': 'My Ingredients',
    'my-releases': 'My Releases',
    'my-workflows': 'My Workflows',
    'my-projects': 'My Projects',
    // Project context
    'ingredients': 'Ingredients',
    'releases': 'Releases',
    'workflows': 'Workflows',
  };

  /** Computed breadcrumbs based on navigation state */
  breadcrumbs = computed<VdcBreadcrumbItem[]>(() => {
    const items: VdcBreadcrumbItem[] = [
      { text: 'VDC', title: 'VDC Home' },
    ];

    const context = this.navService.activeContext();
    items.push({
      text: this.contextLabels[context] || context,
      title: this.contextLabels[context] || context,
    });

    // If in project context with a selected project
    const project = this.navService.selectedProject();
    if (context === 'project' && project) {
      items.push({
        text: project.name,
        title: `Project: ${project.name}`,
      });
    }

    // If an item is selected
    const activeItemId = this.navService.activeItemId();
    if (activeItemId) {
      const label = this.itemLabels[activeItemId] || activeItemId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      items.push({
        text: label,
        title: label,
      });
    }

    return items;
  });

  onItemClick(item: NavItem): void {
    this.lastAction = `Item clicked: ${item.label} (route: ${item.route || 'none'})`;
  }

  onProjectSelect(project: NavProject): void {
    this.lastAction = `Project selected: ${project.name} (${project.shortcode})`;
  }

  onHelpClick(): void {
    this.lastAction = 'Help button clicked';
  }

  onBreadcrumbClick(item: VdcBreadcrumbItem): void {
    this.lastAction = `Breadcrumb clicked: ${item.text}`;
  }

  onReleaseSearch(releaseId: string): void {
    this.lastAction = `Release search: ${releaseId}`;
  }
}
