import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

/**
 * VDC Dropdown Component
 * 
 * Standardized dropdown wrapper over Kendo DropDownList with VDC styling.
 * Supports both standalone and form-integrated usage.
 * 
 * @example
 * <vdc-dropdown 
 *   [data]="options" 
 *   textField="name" 
 *   valueField="id"
 *   placeholder="Select an option"
 *   [(ngModel)]="selectedValue">
 * </vdc-dropdown>
 */
@Component({
  selector: 'vdc-dropdown',
  standalone: true,
  imports: [CommonModule, DropDownListModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VdcDropdownComponent),
      multi: true
    }
  ],
  template: `
    <div class="vdc-dropdown" [class.vdc-dropdown--disabled]="disabled">
      @if (label) {
        <label class="vdc-dropdown__label">{{ label }}</label>
      }
      
      <kendo-dropdownlist
        [data]="data"
        [textField]="textField || ''"
        [valueField]="valueField || ''"
        [valuePrimitive]="valuePrimitive"
        [value]="value"
        [disabled]="disabled"
        [loading]="loading"
        [filterable]="filterable"
        [defaultItem]="placeholder ? { text: placeholder } : undefined"
        (valueChange)="onValueChange($event)"
        (filterChange)="onFilterChange($event)"
        class="vdc-dropdown__input">
      </kendo-dropdownlist>
      
      @if (hint && !error) {
        <span class="vdc-dropdown__hint">{{ hint }}</span>
      }
      
      @if (error) {
        <span class="vdc-dropdown__error">{{ error }}</span>
      }
    </div>
  `,
  styles: [`
    .vdc-dropdown {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-xs);
    }

    .vdc-dropdown__label {
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
    }

    .vdc-dropdown__input {
      width: 100%;
    }

    .vdc-dropdown__hint {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
    }

    .vdc-dropdown__error {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-error);
    }

    .vdc-dropdown--disabled {
      opacity: 0.6;
    }

    ::ng-deep .k-dropdownlist {
      font-family: var(--vdc-font-family);
    }
  `]
})
export class VdcDropdownComponent implements ControlValueAccessor {
  /** Data source for the dropdown */
  @Input() data: any[] = [];
  
  /** Field name to display as text */
  @Input() textField?: string;
  
  /** Field name for the value */
  @Input() valueField?: string;
  
  /** Whether to use primitive values (true) or object values (false) */
  @Input() valuePrimitive = true;
  
  /** Label text */
  @Input() label?: string;
  
  /** Placeholder text */
  @Input() placeholder = 'Select...';
  
  /** Hint text */
  @Input() hint?: string;
  
  /** Error message */
  @Input() error?: string;
  
  /** Whether the dropdown is disabled */
  @Input() disabled = false;
  
  /** Whether the dropdown is loading */
  @Input() loading = false;
  
  /** Whether filtering is enabled */
  @Input() filterable = false;
  
  /** Value change event */
  @Output() valueChange = new EventEmitter<any>();
  
  /** Filter change event */
  @Output() filterChange = new EventEmitter<string>();
  
  /** Current value */
  value: any;
  
  // ControlValueAccessor implementation
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  
  writeValue(value: any): void {
    this.value = value;
  }
  
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  onValueChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }
  
  onFilterChange(filter: string): void {
    this.filterChange.emit(filter);
  }
}
