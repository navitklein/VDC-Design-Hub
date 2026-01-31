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

// ============================================
// VDC Icon Catalog - Supports icon comparison
// ============================================

/**
 * A single icon variant (current production or alternative option)
 */
export interface VdcIconVariant {
  /** Label for this variant (e.g., "Current", "Option A", "Option B") */
  label: string;
  
  /** Font Awesome class (e.g., "fa-regular fa-download") */
  fontAwesome: string;
  
  /** True if this variant is currently used in VDC production */
  isProduction: boolean;
}

/**
 * A VDC icon concept that can have multiple variants for comparison
 */
export interface VdcIconConcept {
  /** Display name for this icon concept */
  name: string;
  
  /** Purpose/usage description */
  purpose: string;
  
  /** VDC entity this icon represents (null if not an entity icon) */
  entity: string | null;
  
  /** Category for grouping */
  category: string;
  
  /** Available icon variants (current production + alternatives) */
  variants: VdcIconVariant[];
}

/**
 * Structure of the vdc-icons.json file
 */
export interface VdcIconsFile {
  categories: IconCategory[];
  icons: VdcIconConcept[];
}
