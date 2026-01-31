import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

import { SimulatorStateService } from '../../../core/services/simulator-state.service';
import { AnnotationService } from '../../../core/services/annotation.service';
import { SimulatorState, SIMULATOR_STATE_OPTIONS } from '../../../core/models';

/**
 * Global Simulator Bar Component
 * 
 * A floating control bar that appears on mockup pages, allowing users to:
 * - Switch between different states (Loading, Empty, Data, Error)
 * - Toggle UX annotations visibility
 * - Collapse/expand the bar
 * 
 * Keyboard shortcuts:
 * - 1-4: Switch states
 * - A: Toggle annotations
 */
@Component({
  selector: 'app-simulator-bar',
  standalone: true,
  imports: [
    CommonModule,
    DropDownListModule,
    SwitchModule,
    ButtonsModule,
    TooltipModule
  ],
  templateUrl: './simulator-bar.component.html',
  styleUrl: './simulator-bar.component.scss'
})
export class SimulatorBarComponent {
  private readonly simulatorService = inject(SimulatorStateService);
  private readonly annotationService = inject(AnnotationService);
  
  /** State options for dropdown */
  readonly stateOptions = SIMULATOR_STATE_OPTIONS;
  
  /** Current state from service */
  readonly currentState = this.simulatorService.currentState;
  
  /** Current state option object */
  readonly currentStateOption = this.simulatorService.currentStateOption;
  
  /** Annotations visible state */
  readonly annotationsVisible = this.annotationService.visible;
  
  /** Whether the bar is collapsed */
  readonly collapsed = signal(false);
  
  /**
   * Handle state change from dropdown
   */
  onStateChange(state: SimulatorState): void {
    this.simulatorService.setState(state);
  }
  
  /**
   * Toggle annotations visibility
   */
  onAnnotationsToggle(checked: boolean): void {
    this.annotationService.setVisible(checked);
  }
  
  /**
   * Toggle collapsed state
   */
  toggleCollapsed(): void {
    this.collapsed.update(v => !v);
  }
  
  /**
   * Handle keyboard shortcuts
   */
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    // Don't handle if user is typing in an input
    if (this.isTyping(event)) {
      return;
    }
    
    // State shortcuts (1-4)
    if (['1', '2', '3', '4'].includes(event.key)) {
      this.simulatorService.setStateByShortcut(event.key);
      event.preventDefault();
      return;
    }
    
    // Annotation toggle (A)
    if (event.key.toLowerCase() === 'a') {
      this.annotationService.toggle();
      event.preventDefault();
      return;
    }
  }
  
  /**
   * Check if user is typing in an input field
   */
  private isTyping(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    return target.tagName === 'INPUT' || 
           target.tagName === 'TEXTAREA' || 
           target.isContentEditable;
  }
  
  /**
   * Get the state indicator class
   */
  getStateClass(state: SimulatorState): string {
    return `state-indicator--${state}`;
  }
}
