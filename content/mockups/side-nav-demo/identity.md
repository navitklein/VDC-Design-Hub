# Side Navigation Demo

## Problem Statement

VDC applications lack a consistent, intuitive navigation pattern that allows users to quickly switch between different contexts (global tools, personal workspace, and project-specific views) while maintaining awareness of their current location in the application hierarchy.

## Design Goals

1. **Context Awareness**: Users should always know which context they're working in
2. **Quick Switching**: Enable fast transitions between global, personal, and project contexts
3. **Project Selection**: Provide an efficient way to browse and switch between projects
4. **Scalability**: Support navigation structures that may grow with new features

## User Research

- Navigation patterns observed in VDC production
- Common workflows identified: context switching, project browsing, quick access to entities

## Key Findings

1. **2-Tier Navigation**: Separating context selection (tier 1) from navigation items (tier 2) reduces cognitive load
2. **Visual Context Cues**: Color-coding contexts helps users maintain orientation
3. **Project Browser**: Users frequently switch between recent projects
4. **Entity Icons**: Icons improve scanability of navigation items

## Technical Constraints

- Must use Kendo UI components as base
- Must follow VDC design tokens for colors, spacing, typography
- Panel must be collapsible for more content space
- Must integrate with breadcrumb navigation

## Design Decisions Made

| Decision | Rationale |
|----------|-----------|
| Dimmed/bright icon approach for active state | Subtle but clear indication without heavy borders |
| Context colors on icon rail | Immediate visual feedback of current context |
| Project initials in rail | Quick project identification without expanding panel |
| "My Projects" filter pill | Common use case for filtering to owned projects |
| Cancel switch feature | Allow undoing accidental project switches |
| 48px panel header | Aligns with top navigation for visual consistency |
| Entity icons on nav items | Faster recognition of navigation destinations |

## Components Used

- **VdcSideNav**: Main 2-tier navigation component
- **VdcTopNav**: Top bar with breadcrumbs and collapse control
- **VdcBreadcrumbs**: Navigation path display

## Out of Scope

- Mobile/responsive layout (future phase)
- Drag-and-drop reordering of navigation items
- Custom user shortcuts
- Notification badges on navigation items
