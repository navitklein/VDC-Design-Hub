import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule, ButtonThemeColor } from '@progress/kendo-angular-buttons';

export type VdcButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type VdcButtonSize = 'small' | 'medium' | 'large';

/**
 * VDC Button Component
 * 
 * Standardized button wrapper over Kendo Button with VDC styling.
 * 
 * @example
 * <vdc-button variant="primary" (clicked)="onSave()">Save</vdc-button>
 * <vdc-button variant="destructive" icon="fa-trash">Delete</vdc-button>
 */
@Component({
  selector: 'vdc-button',
  standalone: true,
  imports: [CommonModule, ButtonsModule],
  template: `
    <button 
      kendoButton 
      [themeColor]="themeColor"
      [look]="look"
      [disabled]="disabled"
      [class]="buttonClass"
      (click)="onClick($event)">
      @if (icon) {
        <i [class]="'fa-solid ' + icon"></i>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    button {
      font-family: var(--vdc-font-family);
      transition: all 0.15s ease;
      // Focus ring is handled by global _kendo-fluent-overrides.scss
    }

    .vdc-button--small {
      padding: 4px 8px;
      font-size: var(--vdc-font-size-sm);
    }

    .vdc-button--large {
      padding: 12px 24px;
      font-size: var(--vdc-font-size-lg);
    }

    .vdc-button--destructive {
      background-color: var(--vdc-error) !important;
      border-color: var(--vdc-error) !important;

      &:hover:not(:disabled) {
        background-color: #b71c1c !important;
        border-color: #b71c1c !important;
      }
    }

    .vdc-button--ghost {
      background-color: transparent !important;
      border-color: transparent !important;
      color: var(--vdc-text-primary) !important;

      &:hover:not(:disabled) {
        background-color: var(--vdc-surface-300) !important;
      }
    }

    i {
      margin-right: 6px;
    }
  `]
})
export class VdcButtonComponent {
  /** Button variant determines color scheme */
  @Input() variant: VdcButtonVariant = 'primary';
  
  /** Button size */
  @Input() size: VdcButtonSize = 'medium';
  
  /** Whether the button is disabled */
  @Input() disabled = false;
  
  /** Font Awesome icon class (e.g., 'fa-plus') */
  @Input() icon?: string;
  
  /** Click event emitter */
  @Output() clicked = new EventEmitter<MouseEvent>();
  
  get themeColor(): ButtonThemeColor {
    switch (this.variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
      case 'ghost':
        return 'base';
      case 'destructive':
        return 'error';
      default:
        return 'base';
    }
  }
  
  get look(): 'flat' | 'outline' | 'clear' | 'default' {
    return this.variant === 'ghost' ? 'flat' : 'default';
  }
  
  get buttonClass(): string {
    const classes = ['vdc-button'];
    classes.push(`vdc-button--${this.size}`);
    if (this.variant === 'destructive') {
      classes.push('vdc-button--destructive');
    }
    if (this.variant === 'ghost') {
      classes.push('vdc-button--ghost');
    }
    return classes.join(' ');
  }
  
  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}
