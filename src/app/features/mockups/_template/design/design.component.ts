import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulatorBarComponent } from '../../../../shared/components/simulator-bar';
import { SimulatorStateService } from '../../../../core/services/simulator-state.service';
import { AnnotationDirective } from '../../../../shared/directives/annotation.directive';

/**
 * Design Component Template - The actual mockup view
 * This is a template that should be customized for each feature
 * 
 * Responds to simulator state changes:
 * - loading: Show skeleton/spinner
 * - empty: Show empty state
 * - data: Show populated mockup
 * - error: Show error state
 */
@Component({
  selector: 'app-design',
  standalone: true,
  imports: [CommonModule, SimulatorBarComponent, AnnotationDirective],
  template: `
    <!-- Simulator Bar -->
    <app-simulator-bar></app-simulator-bar>

    <!-- Mockup Content -->
    <div class="design">
      @switch (simulatorState()) {
        @case ('loading') {
          <div class="design__loading">
            <div class="vdc-skeleton" style="height: 60px; margin-bottom: 24px;"></div>
            <div class="vdc-skeleton" style="height: 400px;"></div>
          </div>
        }
        
        @case ('empty') {
          <div class="vdc-empty-state">
            <i class="fa-solid fa-inbox vdc-empty-state__icon"></i>
            <h3 class="vdc-empty-state__title">No Data Available</h3>
            <p class="vdc-empty-state__description">
              This view shows how the UI appears when there is no data
            </p>
          </div>
        }
        
        @case ('error') {
          <div class="vdc-error-state">
            <i class="fa-solid fa-exclamation-triangle vdc-error-state__icon"></i>
            <h3 class="vdc-error-state__title">Something Went Wrong</h3>
            <p class="vdc-error-state__description">
              This view shows how the UI handles error states
            </p>
          </div>
        }
        
        @case ('data') {
          <!-- 
            MOCKUP CONTENT GOES HERE
            Replace this placeholder with your actual mockup design
          -->
          <div class="design__placeholder">
            <div 
              class="design__header"
              [appAnnotation]="{ 
                title: 'Page Header', 
                note: 'Contains title, breadcrumb, and primary actions',
                position: 'top-right' 
              }">
              <h1>Feature Title</h1>
              <div class="design__actions">
                <button class="btn btn--secondary">Secondary</button>
                <button class="btn btn--primary">Primary Action</button>
              </div>
            </div>

            <div 
              class="design__content"
              [appAnnotation]="{ 
                title: 'Main Content Area', 
                note: 'This is where the primary content of the feature lives',
                position: 'top-left' 
              }">
              <p class="vdc-body">
                This is a template design component. Customize this component 
                for your specific mockup needs.
              </p>
              <p class="vdc-caption">
                Use VDC Library components to build your mockup. 
                The simulator bar allows switching between different states.
              </p>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .design {
      padding: var(--vdc-space-lg);
      padding-bottom: 100px; /* Space for simulator bar */
      min-height: 100vh;
      background-color: var(--vdc-surface-200);
    }

    .design__loading {
      /* Remove max-width to allow full screen usage */
    }

    .design__placeholder {
      /* Remove max-width to allow full screen usage */
    }

    .design__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--vdc-space-lg);
      background-color: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      margin-bottom: var(--vdc-space-lg);

      h1 {
        margin: 0;
        font-size: var(--vdc-font-size-2xl);
        font-weight: var(--vdc-font-weight-bold);
      }
    }

    .design__actions {
      display: flex;
      gap: var(--vdc-space-sm);
    }

    .design__content {
      padding: var(--vdc-space-xl);
      background-color: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      min-height: 400px;
    }

    .btn {
      padding: var(--vdc-space-sm) var(--vdc-space-md);
      border-radius: var(--vdc-radius-md);
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-semibold);
      cursor: pointer;
      border: none;
      transition: all 0.15s ease;

      &--primary {
        background-color: var(--vdc-primary);
        color: white;

        &:hover {
          background-color: var(--vdc-primary-hover);
        }
      }

      &--secondary {
        background-color: var(--vdc-surface-300);
        color: var(--vdc-text-primary);

        &:hover {
          background-color: var(--vdc-surface-400);
        }
      }
    }
  `]
})
export class DesignComponent {
  private readonly simulatorService = inject(SimulatorStateService);
  
  readonly simulatorState = this.simulatorService.currentState;
}
