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

- Focus ring uses subtle semi-transparent blue (`rgba(15, 108, 189, 0.5)`) instead of harsh black
- Focus ring is visible on all interactive elements for keyboard navigation
- Destructive and Ghost variants maintain visual distinction on focus
- Use descriptive text that indicates the action
- For icon-only buttons, provide an `aria-label`

## Focus Ring Styling

VdcButton uses a visible but subtle focus ring for accessibility:

- **Color**: `rgba(15, 108, 189, 0.5)` (50% opacity primary blue)
- **Width**: `2px`
- **Offset**: `2px` (gap between button and focus ring)
- **Box-shadow**: `none` (important: removes Kendo's default black shadow)

This is configured globally in `_kendo-fluent-overrides.scss` and applies to all Kendo buttons and chips.

### CSS Implementation

```scss
.k-button:focus,
.k-button.k-focus {
  outline: 2px solid rgba(15, 108, 189, 0.5);
  outline-offset: 2px;
  box-shadow: none;  // Required to remove Kendo's black shadow
}
```

### Special Case: Dark Backgrounds

For buttons on dark/colored backgrounds (like the side navigation rail), use a white focus ring:

```scss
.dark-background .k-button:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
  box-shadow: none;
}
```

### What NOT to Do

```scss
// DON'T: Remove focus ring entirely - breaks accessibility
.k-button:focus {
  outline: none;  // Bad for keyboard users!
}

// DON'T: Forget box-shadow - leaves black border
.k-button:focus {
  outline: 2px solid blue;
  // Missing box-shadow: none; leaves dark border
}
```

See also: [VdcChip](vdc-chip.md) for chip/filter pill focus styling, and the Style Guide > Usage Guidelines > Focus section for complete focus ring guidelines.
