# VdcButton

Standardized button component with primary, secondary, and destructive variants.

## Usage

```html
<vdc-button variant="primary" (clicked)="onSave()">Save</vdc-button>
<vdc-button variant="destructive" icon="fa-trash">Delete</vdc-button>
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'destructive' \| 'ghost'` | `'primary'` | Button color scheme |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `disabled` | `boolean` | `false` | Disable the button |
| `icon` | `string` | - | Font Awesome icon class (e.g., `'fa-plus'`) |

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| `clicked` | `EventEmitter<MouseEvent>` | Emitted when button is clicked |

## Do's and Don'ts

### Do's

- Use **Primary** for the main action on a page (e.g., Save, Submit)
- Use **Secondary** for secondary actions (e.g., Cancel, Back)
- Use **Destructive** ONLY for delete/remove actions
- Use **Ghost** for subtle actions in toolbars or inline

### Don'ts

- Don't use multiple primary buttons in the same section
- Don't use destructive variant for non-destructive actions
- Don't mix different button sizes in the same button group

## Accessibility

- Buttons automatically receive focus styling
- Use descriptive text that indicates the action
- For icon-only buttons, provide an `aria-label`
