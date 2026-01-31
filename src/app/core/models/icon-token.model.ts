/**
 * Represents an icon in the design system
 */
export interface IconToken {
  /** Icon name identifier */
  name: string;
  
  /** Font Awesome class (e.g., 'fa-briefcase') */
  fontAwesome: string;
  
  /** VDC entity this icon represents (null if not an entity icon) */
  entity: string | null;
  
  /** Usage guidelines for this icon */
  usage: string;
  
  /** Allowed sizes for this icon */
  sizes: string[];
  
  /** Color token to use with this icon */
  colorToken: string;
  
  /** Category for grouping */
  category: string;
}

/**
 * Category grouping for icons
 */
export interface IconCategory {
  name: string;
  description: string;
}

/**
 * Structure of the icons.json token file
 */
export interface IconsFile {
  categories: IconCategory[];
  icons: IconToken[];
}
