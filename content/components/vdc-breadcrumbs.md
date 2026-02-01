# VdcBreadcrumbs

Breadcrumb navigation component with custom slash separator, built on Kendo UI Breadcrumb.

## Usage

```html
<vdc-breadcrumbs [items]="breadcrumbItems"></vdc-breadcrumbs>
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `items` | `BreadCrumbItem[]` | `[]` | Array of breadcrumb items to display |

## Item Structure

```typescript
interface BreadCrumbItem {
  text: string;      // Display text
  title?: string;    // Tooltip text (optional)
  disabled?: boolean; // Whether item is clickable
}
```

## Example

```typescript
breadcrumbItems: BreadCrumbItem[] = [
  { text: 'Global Explorer' },
  { text: 'Project Explorer' },
  { text: 'Meteor Lake-S' }
];
```

## Design Decisions

- **Slash separator**: Uses `/` as separator instead of chevron for cleaner look
- **VDC styling**: Applies VDC typography tokens and colors
- **No icons**: Items display text only, no icons

## Kendo Documentation

- [Kendo Breadcrumb](https://www.telerik.com/kendo-angular-ui/components/navigation/breadcrumb)

## Do's and Don'ts

### Do's

- Keep breadcrumb text concise
- Limit depth to 3-4 levels maximum
- Use consistent naming conventions

### Don'ts

- Don't include the current page as a clickable link
- Don't use overly long text that will truncate
- Don't nest breadcrumbs inside other navigation components
