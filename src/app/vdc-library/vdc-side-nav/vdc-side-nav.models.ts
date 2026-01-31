/**
 * VDC Side Navigation Models
 * Interfaces for the 2-tier navigation component
 */

/** Navigation context types */
export type NavContextType = 'global' | 'personal' | 'project';

/** Theme options */
export type ThemeType = 'light' | 'dark';

/** Navigation context configuration */
export interface NavContext {
  id: NavContextType;
  label: string;
  icon: string;
  colorToken: string;
  panelTitle: string;
}

/** Individual navigation item */
export interface NavItem {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  badge?: string;
  disabled?: boolean;
}

/** Section of navigation items */
export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

/** Panel configuration for a context */
export interface NavPanel {
  contextId: NavContextType;
  sections: NavSection[];
}

/** Project entity for project browser/context */
export interface NavProject {
  id: string;
  name: string;
  shortcode: string;
  lastAccessed?: Date | string;
}

/** Overall navigation state */
export interface NavState {
  activeContext: NavContextType;
  selectedProject: NavProject | null;
  activeItemId: string | null;
  theme: ThemeType;
}

/** User profile information */
export interface NavUserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
}

/** Navigation configuration (loaded from JSON) */
export interface NavConfiguration {
  contexts: NavContext[];
  panels: NavPanel[];
  projectContextSections: NavSection[];
  recentProjects: NavProject[];
}
