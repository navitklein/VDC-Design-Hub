import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

/**
 * Layout for feature module pages (Identity, Spec views).
 * Provides tabs navigation between feature views.
 */
@Component({
  selector: 'app-feature-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonsModule],
  template: `
    <div class="feature-layout">
      <!-- Feature Header -->
      <header class="feature-layout__header">
        <div class="feature-layout__breadcrumb">
          <a routerLink="/dashboard" class="feature-layout__breadcrumb-link">
            <i class="fa-solid fa-arrow-left"></i>
            Back to Dashboard
          </a>
        </div>

        <h1 class="feature-layout__title">{{ featureName }}</h1>

        <!-- Tabs -->
        <nav class="feature-layout__tabs">
          <a 
            [routerLink]="['identity']" 
            routerLinkActive="feature-layout__tab--active"
            class="feature-layout__tab">
            <i class="fa-solid fa-id-card"></i>
            Identity
          </a>
          <a 
            [routerLink]="['spec']" 
            routerLinkActive="feature-layout__tab--active"
            class="feature-layout__tab">
            <i class="fa-solid fa-layer-group"></i>
            Component Spec
          </a>
          <button 
            kendoButton 
            themeColor="primary"
            (click)="launchMockup()"
            class="feature-layout__launch-btn">
            <i class="fa-solid fa-external-link-alt"></i>
            Launch Mockup
          </button>
        </nav>
      </header>

      <!-- Content -->
      <div class="feature-layout__content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .feature-layout {
      display: flex;
      flex-direction: column;
    }

    .feature-layout__header {
      background-color: var(--vdc-surface-100);
      padding: var(--vdc-space-lg);
      border-radius: var(--vdc-radius-lg);
      margin-bottom: var(--vdc-space-lg);
    }

    .feature-layout__breadcrumb {
      margin-bottom: var(--vdc-space-md);
    }

    .feature-layout__breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: var(--vdc-space-xs);
      color: var(--vdc-text-secondary);
      text-decoration: none;
      font-size: var(--vdc-font-size-sm);

      &:hover {
        color: var(--vdc-primary);
      }
    }

    .feature-layout__title {
      font-size: var(--vdc-font-size-2xl);
      font-weight: var(--vdc-font-weight-bold);
      color: var(--vdc-text-primary);
      margin: 0 0 var(--vdc-space-lg);
    }

    .feature-layout__tabs {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
      border-top: 1px solid var(--vdc-border-subtle);
      padding-top: var(--vdc-space-md);
    }

    .feature-layout__tab {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-xs);
      padding: var(--vdc-space-sm) var(--vdc-space-md);
      text-decoration: none;
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-md);
      border-radius: var(--vdc-radius-md);
      border: 1px solid transparent;
      transition: all 0.15s ease;

      &:hover {
        background-color: var(--vdc-surface-200);
        color: var(--vdc-text-primary);
      }

      &--active {
        background-color: var(--vdc-surface-200);
        color: var(--vdc-primary);
        border-color: var(--vdc-primary);
      }

      i {
        font-size: 14px;
      }
    }

    .feature-layout__launch-btn {
      margin-left: auto;
    }

    .feature-layout__content {
      background-color: var(--vdc-surface-100);
      padding: var(--vdc-space-lg);
      border-radius: var(--vdc-radius-lg);
      min-height: 400px;
    }
  `]
})
export class FeatureLayoutComponent {
  private readonly route = inject(ActivatedRoute);
  
  @Input() featureName: string = 'Feature';
  
  /**
   * Get the feature slug from the route
   */
  get featureSlug(): string {
    return this.route.snapshot.paramMap.get('slug') || '';
  }
  
  /**
   * Launch the mockup in a new tab
   */
  launchMockup(): void {
    const url = `/simulate/${this.featureSlug}`;
    window.open(url, '_blank');
  }
}
