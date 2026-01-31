import { Injectable, signal } from '@angular/core';

/**
 * Service that manages annotation visibility state.
 * Used by the simulator bar and annotation directive.
 */
@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  /** Whether annotations are currently visible */
  private readonly _visible = signal<boolean>(false);
  
  /** Readonly signal for annotation visibility */
  readonly visible = this._visible.asReadonly();
  
  /**
   * Toggle annotation visibility
   */
  toggle(): void {
    this._visible.update(v => !v);
  }
  
  /**
   * Show annotations
   */
  show(): void {
    this._visible.set(true);
  }
  
  /**
   * Hide annotations
   */
  hide(): void {
    this._visible.set(false);
  }
  
  /**
   * Set annotation visibility
   * @param visible Whether annotations should be visible
   */
  setVisible(visible: boolean): void {
    this._visible.set(visible);
  }
}
