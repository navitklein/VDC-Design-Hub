# VdcChip

Filter pills and selection chips using Kendo ChipList for single or multi-select filtering.

## Usage

```html
<!-- Single selection filter -->
<kendo-chiplist [selection]="'single'">
  <kendo-chip label="All" [selected]="true"></kendo-chip>
  <kendo-chip label="Active"></kendo-chip>
  <kendo-chip label="Completed"></kendo-chip>
</kendo-chiplist>

<!-- With counts -->
<kendo-chiplist [selection]="'single'">
  <kendo-chip 
    [label]="'Workflow (' + count + ')'"
    [selected]="isSelected"
    (contentClick)="onSelect()">
  </kendo-chip>
</kendo-chiplist>
```

## Kendo Components

| Component | Purpose |
|-----------|---------|
| `kendo-chiplist` | Container for chips, handles selection mode |
| `kendo-chip` | Individual chip/pill element |

## Inputs (kendo-chip)

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string` | - | Text displayed in the chip |
| `selected` | `boolean` | `false` | Whether the chip is selected |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Chip size |
| `rounded` | `'small' \| 'medium' \| 'large' \| 'full'` | `'medium'` | Border radius |
| `removable` | `boolean` | `false` | Shows remove icon |

## Inputs (kendo-chiplist)

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `selection` | `'none' \| 'single' \| 'multiple'` | `'none'` | Selection mode |

## When to Use Chips vs Buttons

| Use Case | Component |
|----------|-----------|
| Filter options (single select) | Chips with `selection="single"` |
| Filter options (multi select) | Chips with `selection="multiple"` |
| Tags or labels | Chips (non-selectable) |
| Actions (Save, Delete, Submit) | Buttons |
| Navigation | Buttons or Links |

## Accessibility

- Focus ring uses subtle semi-transparent blue (`rgba(15, 108, 189, 0.5)`)
- Focus ring is visible for keyboard navigation
- Selected state is visually distinct (filled background)
- Use descriptive labels that indicate the filter purpose

## Focus Ring Styling

VdcChip uses the same focus ring styling as buttons for consistency:

- **Color**: `rgba(15, 108, 189, 0.5)` (50% opacity primary blue)
- **Width**: `2px`
- **Offset**: `2px` (gap between chip and focus ring)
- **Box-shadow**: `none` (removes Kendo's default black shadow)

This is configured globally in `_kendo-fluent-overrides.scss`:

```scss
.k-chip:focus,
.k-chip.k-focus,
.k-chip.k-selected:focus {
  outline: 2px solid rgba(15, 108, 189, 0.5);
  outline-offset: 2px;
  box-shadow: none;
}
```

## Do's and Don'ts

### Do's

- Use `rounded="full"` for filter pills to match VDC design
- Use `size="large"` for main filter controls
- Include counts in labels when filtering data (e.g., "Active (5)")
- Use single selection for mutually exclusive filters

### Don'ts

- Don't use chips for primary actions (use buttons instead)
- Don't mix chip sizes in the same chiplist
- Don't use `outline: none` - this breaks accessibility

## Kendo Documentation

- [ChipList](https://www.telerik.com/kendo-angular-ui/components/buttons/chiplist)
- [Chip](https://www.telerik.com/kendo-angular-ui/components/buttons/chip)
