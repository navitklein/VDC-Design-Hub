import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Component Spec - Isolated view of specific components created for a feature
 * Optional view for showcasing custom components
 */
@Component({
  selector: 'app-spec',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spec">
      <div class="vdc-empty-state">
        <i class="fa-solid fa-layer-group vdc-empty-state__icon"></i>
        <h3 class="vdc-empty-state__title">Component Specifications</h3>
        <p class="vdc-empty-state__description">
          This section will showcase isolated components created specifically 
          for this feature, with their various states and configurations.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .spec {
      padding: var(--vdc-space-lg);
    }
  `]
})
export class SpecComponent {}
