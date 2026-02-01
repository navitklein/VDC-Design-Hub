# VdcSideNav

2-tier side navigation component with icon rail (tier 1) and content panel (tier 2). Supports Global, Personal, and Project contexts with collapsible panel.

## Usage

```html
<vdc-side-nav
  [contexts]="navContexts"
  [globalSections]="globalItems"
  [personalSections]="personalItems"
  [projectContextSections]="projectItems"
  [recentProjects]="projects">
</vdc-side-nav>
```

## Architecture

The component consists of two tiers:

1. **Icon Rail (Tier 1)**: Vertical strip of context icons (Global, Personal, Project)
2. **Content Panel (Tier 2)**: Expandable panel showing navigation items for selected context

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `contexts` | `NavContext[]` | - | Array of navigation contexts |
| `globalSections` | `NavSection[]` | `[]` | Navigation items for Global context |
| `personalSections` | `NavSection[]` | `[]` | Navigation items for Personal context |
| `projectContextSections` | `NavSection[]` | `[]` | Navigation items for Project context |
| `recentProjects` | `NavProject[]` | `[]` | List of recent projects for browser |

## Data Structures

```typescript
interface NavContext {
  id: 'global' | 'personal' | 'project';
  icon: string;           // FontAwesome class
  label: string;          // Tooltip text
  panelTitle: string;     // Panel header text
  colorVar: string;       // CSS variable for context color
}

interface NavSection {
  label?: string;         // Optional section header
  items: NavItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon?: string;          // FontAwesome class for entity icon
  route?: string;
}

interface NavProject {
  id: string;
  name: string;
  shortcode: string;
}
```

## Features

### Context Switching
- Click icon rail buttons to switch between Global, Personal, and Project contexts
- Active context shows full opacity icon; inactive contexts are dimmed (40% opacity)

### Project Browser
- Search projects by name
- "My Projects" filter pill with count badge
- Cancel switch button to return to previous project

### Project Initials
- When a project is selected, the Project context button shows project initials
- Initials derived from shortcode (first 3 characters before dash)

### Entity Icons
- Each navigation item displays an icon representing the entity type
- Icons use context color when item is active

### Active State Styling
- Active nav items show:
  - Context-colored background tint (12% opacity)
  - Left border in context color
  - Text and icon in context color

## Integration with VdcTopNav

The side nav works with VdcTopNav through `VdcSideNavService`:

```typescript
// In your component
constructor(public navService: VdcSideNavService) {}

// Toggle panel expansion
navService.togglePanel();

// Check panel state
navService.isPanelExpanded();
```

## Design Decisions

- **Dimmed/bright approach**: Inactive icons at 40% opacity, active at 100%
- **Context colors**: Each context has a distinct color (global=blue, personal=purple, project=teal)
- **Panel header alignment**: 48px height matches top nav for visual consistency
- **Cancel switch**: Allows returning to previous project without selecting a new one

## Kendo Components Used

- `kendoButton` - Context buttons, nav items, filter pill
- `kendo-textbox` - Project search input
- `kendoTooltip` - Icon rail tooltips

## Kendo Documentation

- [Button](https://www.telerik.com/kendo-angular-ui/components/buttons/button)
- [TextBox](https://www.telerik.com/kendo-angular-ui/components/inputs/textbox)
- [Tooltip](https://www.telerik.com/kendo-angular-ui/components/tooltip)
