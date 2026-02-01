/**
 * Represents a color token in the design system (flattened for display)
 */
export interface ColorToken {
  /** CSS custom property name (without --) */
  token: string;
  
  /** Hex color value */
  hex: string;
  
  /** RGB color values as string (optional for new format) */
  rgb?: string;
  
  /** Usage guidelines for this color */
  usage: string;
  
  /** Category for grouping */
  category: string;
  
  /** Reference to source palette (for semantic colors) */
  paletteRef?: string;
}

/**
 * Category grouping for colors
 */
export interface ColorCategory {
  name: string;
  description: string;
}

/**
 * A single color in a palette
 */
export interface PaletteColor {
  shade: string;
  hex: string;
}

/**
 * A color palette (e.g., Blue, Green, Neutral Gray)
 */
export interface ColorPalette {
  name: string;
  description: string;
  usage: string;
  colors: PaletteColor[];
}

/**
 * A semantic color entry
 */
export interface SemanticColor {
  token: string;
  hex: string;
  paletteRef: string;
  usage: string;
}

/**
 * A semantic color group (e.g., primary, success, error)
 */
export interface SemanticColorGroup {
  description: string;
  colors: SemanticColor[];
}

/**
 * VDC custom color entry
 */
export interface VdcColor {
  token: string;
  hex: string;
  usage: string;
}

/**
 * VDC color group
 */
export interface VdcColorGroup {
  description: string;
  colors: VdcColor[];
}

/**
 * VDC colors section with root description
 */
export interface VdcColorsSection {
  description: string;
  [key: string]: VdcColorGroup | string; // Groups or the description string
}

/**
 * Usage guidelines rule types
 */
export interface SurfaceRule {
  component: string;
  light: string;
  dark: string;
  notes: string;
}

export interface TextRule {
  use: string;
  token: string;
  notes: string;
}

export interface BorderRule {
  use: string;
  token: string;
  notes: string;
}

export interface StateRule {
  state: string;
  background: string;
  text: string;
  notes: string;
}

export interface UsageGuidelines {
  surfaces: {
    description: string;
    rules: SurfaceRule[];
  };
  text: {
    description: string;
    rules: TextRule[];
  };
  borders: {
    description: string;
    rules: BorderRule[];
  };
  states: {
    description: string;
    rules: StateRule[];
  };
}

/**
 * Structure of the new colors.json token file
 */
export interface ColorsFile {
  meta: {
    source: string;
    lastUpdated: string;
    description: string;
    themes?: string[];
  };
  usageGuidelines?: UsageGuidelines;
  palettes: ColorPalette[];
  semanticColors: Record<string, SemanticColorGroup>;
  semanticColorsDark?: Record<string, SemanticColorGroup>;
  vdcColors: VdcColorsSection;
}
