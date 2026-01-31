/**
 * Represents a color token in the design system
 */
export interface ColorToken {
  /** CSS custom property name (without --) */
  token: string;
  
  /** Hex color value */
  hex: string;
  
  /** RGB color values as string */
  rgb: string;
  
  /** Usage guidelines for this color */
  usage: string;
  
  /** Category for grouping */
  category: string;
}

/**
 * Category grouping for colors
 */
export interface ColorCategory {
  name: string;
  description: string;
}

/**
 * Structure of the colors.json token file
 */
export interface ColorsFile {
  categories: ColorCategory[];
  colors: ColorToken[];
}
