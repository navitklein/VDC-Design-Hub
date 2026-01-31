# VdcDropdown

Dropdown select component with search and loading states.

## Usage

```html
<vdc-dropdown 
  [data]="options" 
  textField="name" 
  valueField="id"
  placeholder="Select an option"
  [(ngModel)]="selectedValue">
</vdc-dropdown>
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `any[]` | `[]` | Data source for options |
| `textField` | `string` | - | Field name to display |
| `valueField` | `string` | - | Field name for value |
| `valuePrimitive` | `boolean` | `true` | Use primitive values |
| `label` | `string` | - | Label text |
| `placeholder` | `string` | `'Select...'` | Placeholder text |
| `hint` | `string` | - | Hint text below dropdown |
| `error` | `string` | - | Error message |
| `disabled` | `boolean` | `false` | Disable the dropdown |
| `loading` | `boolean` | `false` | Show loading state |
| `filterable` | `boolean` | `false` | Enable filtering |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `valueChange` | `EventEmitter<any>` | Value changed |
| `filterChange` | `EventEmitter<string>` | Filter text changed |

## Form Integration

VdcDropdown implements `ControlValueAccessor` for use with Angular forms:

```html
<form [formGroup]="myForm">
  <vdc-dropdown 
    formControlName="status"
    [data]="statusOptions"
    label="Status">
  </vdc-dropdown>
</form>
```

## Do's and Don'ts

### Do's

- Always provide a label for accessibility
- Use `placeholder` to guide the user
- Show loading state when fetching options
- Display error messages below the dropdown

### Don'ts

- Don't use for fewer than 4 options (use radio buttons instead)
- Don't allow very long option text that will truncate
- Don't forget to handle the empty state
