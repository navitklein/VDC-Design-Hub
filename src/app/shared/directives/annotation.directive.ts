import { 
  Directive, 
  Input, 
  ElementRef, 
  inject,
  effect,
  ViewContainerRef,
  ComponentRef,
  OnDestroy
} from '@angular/core';
import { AnnotationService } from '../../core/services/annotation.service';
import { AnnotationConfig } from '../../core/models';
import { AnnotationMarkerComponent } from '../components/annotation-marker/annotation-marker.component';

/** Counter for generating unique annotation numbers */
let annotationCounter = 0;

/**
 * Directive for adding UX annotations to elements.
 * 
 * Usage:
 * ```html
 * <div [appAnnotation]="{ title: 'Action Bar', note: 'Group related actions...' }">
 *   ... content ...
 * </div>
 * ```
 * 
 * When annotations are visible (via AnnotationService), this directive:
 * - Adds a visual marker to the element
 * - Shows the annotation content on hover
 * - Adds an outline to highlight the annotated element
 */
@Directive({
  selector: '[appAnnotation]',
  standalone: true
})
export class AnnotationDirective implements OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly annotationService = inject(AnnotationService);
  
  /** The annotation configuration */
  @Input('appAnnotation') config: AnnotationConfig | null = null;
  
  /** Reference to the created marker component */
  private markerRef: ComponentRef<AnnotationMarkerComponent> | null = null;
  
  /** Unique number for this annotation */
  private readonly annotationNumber: number;
  
  constructor() {
    // Assign unique number
    this.annotationNumber = ++annotationCounter;
    
    // React to visibility changes
    effect(() => {
      const visible = this.annotationService.visible();
      this.updateVisibility(visible);
    });
  }
  
  /**
   * Update the visibility of the annotation marker
   */
  private updateVisibility(visible: boolean): void {
    if (visible && this.config) {
      this.showAnnotation();
    } else {
      this.hideAnnotation();
    }
  }
  
  /**
   * Show the annotation marker
   */
  private showAnnotation(): void {
    if (!this.config || this.markerRef) {
      return;
    }
    
    // Ensure host element has relative positioning
    const hostEl = this.elementRef.nativeElement as HTMLElement;
    const computedStyle = window.getComputedStyle(hostEl);
    if (computedStyle.position === 'static') {
      hostEl.style.position = 'relative';
    }
    
    // Add visible class
    hostEl.classList.add('annotation-visible');
    
    // Create marker component
    this.markerRef = this.viewContainerRef.createComponent(AnnotationMarkerComponent);
    this.markerRef.instance.number = this.annotationNumber;
    this.markerRef.instance.title = this.config.title;
    this.markerRef.instance.note = this.config.note;
    this.markerRef.instance.position = this.config.position || 'top-right';
    
    // Position the marker
    this.positionMarker();
  }
  
  /**
   * Hide the annotation marker
   */
  private hideAnnotation(): void {
    const hostEl = this.elementRef.nativeElement as HTMLElement;
    hostEl.classList.remove('annotation-visible');
    
    if (this.markerRef) {
      this.markerRef.destroy();
      this.markerRef = null;
    }
  }
  
  /**
   * Position the marker component
   */
  private positionMarker(): void {
    if (!this.markerRef) return;
    
    const position = this.config?.position || 'top-right';
    const markerEl = this.markerRef.location.nativeElement as HTMLElement;
    
    // Reset positioning
    markerEl.style.position = 'absolute';
    markerEl.style.top = '';
    markerEl.style.right = '';
    markerEl.style.bottom = '';
    markerEl.style.left = '';
    
    // Apply position
    switch (position) {
      case 'top-right':
        markerEl.style.top = '-8px';
        markerEl.style.right = '-8px';
        break;
      case 'top-left':
        markerEl.style.top = '-8px';
        markerEl.style.left = '-8px';
        break;
      case 'bottom-right':
        markerEl.style.bottom = '-8px';
        markerEl.style.right = '-8px';
        break;
      case 'bottom-left':
        markerEl.style.bottom = '-8px';
        markerEl.style.left = '-8px';
        break;
    }
  }
  
  ngOnDestroy(): void {
    this.hideAnnotation();
  }
}

/**
 * Reset the annotation counter (useful for testing)
 */
export function resetAnnotationCounter(): void {
  annotationCounter = 0;
}
