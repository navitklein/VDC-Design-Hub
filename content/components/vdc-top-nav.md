# VdcTopNav

Top navigation bar with breadcrumbs, panel collapse button, and release search. Integrates with VdcSideNav for panel expansion control.

## Usage

```html
<vdc-top-nav [breadcrumbs]="breadcrumbItems"></vdc-top-nav>
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `breadcrumbs` | `BreadCrumbItem[]` | `[]` | Breadcrumb items for navigation path |

## Features

### Panel Collapse Button
- Toggles VdcSideNav panel expansion
- Icon changes based on state:
  - `fa-angles-left` when panel is expanded
  - `fa-angles-right` when panel is collapsed
- Small button (28x28px) with brand blue color

### Breadcrumb Navigation
- Uses VdcBreadcrumbs component internally
- Shows current navigation path
- Updates dynamically based on context and selection

### Release Search
- Quick search input for releases by ID
- Placeholder: "Search release by ID..."
- Supports enter-to-search

## Integration with VdcSideNav

The top nav uses `VdcSideNavService` to control the side panel:

```typescript
@Component({...})
export class VdcTopNavComponent {
  constructor(public navService: VdcSideNavService) {}
  
  togglePanel(): void {
    this.navService.togglePanel();
  }
}
```

## Layout

```
+------------------------------------------------------------------+
| [Collapse] | Breadcrumbs                    | [Search Input]     |
+------------------------------------------------------------------+
```

## Styling

- Height: 48px (aligns with side nav panel header)
- Background: White with subtle bottom border
- Collapse button: 28x28px with brand blue icon

## Design Decisions

- **Compact collapse button**: Smaller than standard buttons to not dominate the nav
- **No search icon prefix**: Clean search input without redundant icons
- **Aligned heights**: Top nav and side nav panel header both 48px for visual consistency

## Kendo Components Used

- `kendoButton` - Collapse button, search action
- `kendo-textbox` - Search input
- `kendoTooltip` - Button tooltips

## Kendo Documentation

- [Button](https://www.telerik.com/kendo-angular-ui/components/buttons/button)
- [TextBox](https://www.telerik.com/kendo-angular-ui/components/inputs/textbox)
- [Tooltip](https://www.telerik.com/kendo-angular-ui/components/tooltip)
