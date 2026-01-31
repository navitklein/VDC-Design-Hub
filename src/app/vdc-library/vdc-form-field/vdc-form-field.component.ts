import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';

export type VdcInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

/**
 * VDC Form Field Component
 * 
 * Standardized form field with label, input, and validation display.
 * 
 * @example
 * <vdc-form-field
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   hint="We'll never share your email"
 *   [(ngModel)]="email">
 * </vdc-form-field>
 */
@Component({
  selector: 'vdc-form-field',
  standalone: true,
  imports: [CommonModule, InputsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VdcFormFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="vdc-form-field" [class.vdc-form-field--error]="error" [class.vdc-form-field--disabled]="disabled">
      @if (label) {
        <label class="vdc-form-field__label">
          {{ label }}
          @if (required) {
            <span class="vdc-form-field__required">*</span>
          }
        </label>
      }
      
      <kendo-textbox
        [value]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        (valueChange)="onValueChange($event)"
        (blur)="onBlur()"
        class="vdc-form-field__input">
        @if (icon) {
          <ng-template kendoTextBoxPrefixTemplate>
            <i [class]="'fa-solid ' + icon"></i>
          </ng-template>
        }
      </kendo-textbox>
      
      @if (hint && !error) {
        <span class="vdc-form-field__hint">{{ hint }}</span>
      }
      
      @if (error) {
        <span class="vdc-form-field__error">{{ error }}</span>
      }
    </div>
  `,
  styles: [`
    .vdc-form-field {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-xs);
    }

    .vdc-form-field__label {
      font-size: var(--vdc-font-size-sm);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
    }

    .vdc-form-field__required {
      color: var(--vdc-error);
      margin-left: 2px;
    }

    .vdc-form-field__input {
      width: 100%;
    }

    .vdc-form-field__hint {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
    }

    .vdc-form-field__error {
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-error);
    }

    .vdc-form-field--error {
      ::ng-deep .k-textbox {
        border-color: var(--vdc-error);

        &:focus {
          box-shadow: 0 0 0 1px var(--vdc-error);
        }
      }
    }

    .vdc-form-field--disabled {
      opacity: 0.6;
    }

    ::ng-deep {
      .k-textbox {
        font-family: var(--vdc-font-family);
      }

      .k-input-prefix {
        color: var(--vdc-text-secondary);
      }
    }
  `]
})
export class VdcFormFieldComponent implements ControlValueAccessor {
  /** Input type */
  @Input() type: VdcInputType = 'text';
  
  /** Label text */
  @Input() label?: string;
  
  /** Placeholder text */
  @Input() placeholder = '';
  
  /** Hint text */
  @Input() hint?: string;
  
  /** Error message */
  @Input() error?: string;
  
  /** Whether the field is required */
  @Input() required = false;
  
  /** Whether the field is disabled */
  @Input() disabled = false;
  
  /** Whether the field is readonly */
  @Input() readonly = false;
  
  /** Font Awesome icon class for prefix */
  @Input() icon?: string;
  
  /** Current value */
  value: string = '';
  
  // ControlValueAccessor implementation
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }
  
  onBlur(): void {
    this.onTouched();
  }
}
