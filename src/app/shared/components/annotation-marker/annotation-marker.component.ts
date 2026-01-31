import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

/**
 * Visual marker component for annotations.
 * Displays a numbered badge that shows annotation content on hover.
 */
@Component({
  selector: 'app-annotation-marker',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    <div 
      class="annotation-marker"
      [class.annotation-marker--highlight]="highlight()"
      [ngClass]="'annotation-marker--' + position"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      kendoTooltip
      [tooltipTemplate]="tooltipContent"
      position="top"
      showOn="hover">
      {{ number }}
    </div>

    <ng-template #tooltipContent>
      <div class="annotation-tooltip">
        <h4 class="annotation-tooltip__title">{{ title }}</h4>
        <p class="annotation-tooltip__note">{{ note }}</p>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      position: absolute;
      z-index: var(--vdc-z-annotation);
    }
  `]
})
export class AnnotationMarkerComponent {
  /** The number to display in the marker */
  @Input() number: number = 1;
  
  /** Title of the annotation */
  @Input() title: string = '';
  
  /** Note/description of the annotation */
  @Input() note: string = '';
  
  /** Position relative to the host element */
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  
  /** Whether to show highlight animation */
  readonly highlight = signal(false);
  
  onMouseEnter(): void {
    this.highlight.set(true);
  }
  
  onMouseLeave(): void {
    this.highlight.set(false);
  }
}
