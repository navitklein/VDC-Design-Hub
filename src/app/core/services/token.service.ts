import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, forkJoin, map } from 'rxjs';
import { 
  ColorToken, 
  ColorsFile, 
  ColorCategory,
  IconToken, 
  IconsFile, 
  IconCategory,
  VdcIconConcept,
  VdcIconsFile
} from '../models';

/**
 * Service for loading and managing design tokens (colors, icons).
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly http = inject(HttpClient);
  
  // Color state (light theme)
  private readonly _colors = signal<ColorToken[]>([]);
  private readonly _colorCategories = signal<ColorCategory[]>([]);
  readonly colors = this._colors.asReadonly();
  readonly colorCategories = this._colorCategories.asReadonly();
  
  // Color state (dark theme)
  private readonly _colorsDark = signal<ColorToken[]>([]);
  private readonly _colorCategoriesDark = signal<ColorCategory[]>([]);
  readonly colorsDark = this._colorsDark.asReadonly();
  readonly colorCategoriesDark = this._colorCategoriesDark.asReadonly();
  
  // Usage guidelines
  private readonly _usageGuidelines = signal<Record<string, unknown> | null>(null);
  readonly usageGuidelines = this._usageGuidelines.asReadonly();
  
  // Icon state
  private readonly _icons = signal<IconToken[]>([]);
  private readonly _iconCategories = signal<IconCategory[]>([]);
  readonly icons = this._icons.asReadonly();
  readonly iconCategories = this._iconCategories.asReadonly();
  
  // VDC Icon state (with variants for comparison)
  private readonly _vdcIcons = signal<VdcIconConcept[]>([]);
  private readonly _vdcIconCategories = signal<IconCategory[]>([]);
  readonly vdcIcons = this._vdcIcons.asReadonly();
  readonly vdcIconCategories = this._vdcIconCategories.asReadonly();
  
  // Loading state
  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();
  
  /**
   * Load all tokens (colors and icons)
   */
  loadAll(): Observable<void> {
    this._loading.set(true);
    
    return forkJoin({
      colors: this.loadColors(),
      icons: this.loadIcons()
    }).pipe(
      map(() => {
        this._loading.set(false);
      }),
      catchError(err => {
        this._loading.set(false);
        console.error('Error loading tokens:', err);
        return of(undefined);
      })
    );
  }
  
  /**
   * Load color tokens - processes the new nested structure into flat arrays
   */
  loadColors(): Observable<ColorToken[]> {
    return this.http.get<ColorsFile>('/assets/tokens/colors.json').pipe(
      tap(data => {
        // Process light theme colors
        const { colors, categories } = this.flattenColorData(data, 'light');
        this._colors.set(colors);
        this._colorCategories.set(categories);
        
        // Process dark theme colors
        const { colors: darkColors, categories: darkCategories } = this.flattenColorData(data, 'dark');
        this._colorsDark.set(darkColors);
        this._colorCategoriesDark.set(darkCategories);
        
        // Store usage guidelines
        if (data.usageGuidelines) {
          this._usageGuidelines.set(data.usageGuidelines as unknown as Record<string, unknown>);
        }
      }),
      map(() => this._colors()),
      catchError(err => {
        console.error('Error loading colors:', err);
        return of([]);
      })
    );
  }
  
  /**
   * Flatten the nested color structure into arrays for display
   * @param data The colors file data
   * @param theme 'light' or 'dark' to select which semantic colors to use
   */
  private flattenColorData(data: ColorsFile, theme: 'light' | 'dark' = 'light'): { colors: ColorToken[]; categories: ColorCategory[] } {
    const colors: ColorToken[] = [];
    const categories: ColorCategory[] = [];
    
    // Process palettes (same for both themes - these are the raw scales)
    if (data.palettes) {
      for (const palette of data.palettes) {
        const categoryName = `Palette: ${palette.name}`;
        categories.push({ name: categoryName, description: palette.description });
        
        for (const color of palette.colors) {
          colors.push({
            token: `${palette.name.toLowerCase().replace(/\s+/g, '-')}-${color.shade}`,
            hex: color.hex,
            usage: palette.usage,
            category: categoryName
          });
        }
      }
    }
    
    // Select the appropriate semantic colors based on theme
    const semanticSource = theme === 'dark' 
      ? data.semanticColorsDark
      : data.semanticColors;
    
    // Process semantic colors
    if (semanticSource) {
      for (const [groupKey, group] of Object.entries(semanticSource)) {
        // Skip non-object entries
        if (typeof group !== 'object' || !group || !Array.isArray(group.colors)) {
          continue;
        }
        
        const categoryName = theme === 'dark' 
          ? `${this.formatCategoryName(groupKey)} (Dark)`
          : this.formatCategoryName(groupKey);
        categories.push({ name: categoryName, description: group.description });
        
        for (const color of group.colors) {
          colors.push({
            token: color.token,
            hex: color.hex,
            usage: color.usage,
            category: categoryName,
            paletteRef: color.paletteRef
          });
        }
      }
    }
    
    // Process VDC colors (same for both themes for now)
    if (data.vdcColors && theme === 'light') {
      for (const [groupKey, group] of Object.entries(data.vdcColors)) {
        // Skip non-object entries (like root-level description)
        if (typeof group !== 'object' || !group || !Array.isArray(group.colors)) {
          continue;
        }
        
        const categoryName = `VDC: ${this.formatCategoryName(groupKey)}`;
        categories.push({ name: categoryName, description: group.description });
        
        for (const color of group.colors) {
          colors.push({
            token: color.token,
            hex: color.hex,
            usage: color.usage,
            category: categoryName
          });
        }
      }
    }
    
    return { colors, categories };
  }
  
  /**
   * Format a camelCase or kebab-case key into a readable category name
   */
  private formatCategoryName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/-/g, ' ')
      .replace(/^\s+/, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  /**
   * Load icon tokens
   */
  loadIcons(): Observable<IconToken[]> {
    return this.http.get<IconsFile>('/assets/tokens/icons.json').pipe(
      tap(data => {
        this._icons.set(data.icons);
        this._iconCategories.set(data.categories);
      }),
      map(data => data.icons),
      catchError(err => {
        console.error('Error loading icons:', err);
        return of([]);
      })
    );
  }
  
  /**
   * Load VDC icon concepts (with variants for comparison)
   */
  loadVdcIcons(): Observable<VdcIconConcept[]> {
    return this.http.get<VdcIconsFile>('/assets/tokens/vdc-icons.json').pipe(
      tap(data => {
        this._vdcIcons.set(data.icons);
        this._vdcIconCategories.set(data.categories);
      }),
      map(data => data.icons),
      catchError(err => {
        console.error('Error loading VDC icons:', err);
        return of([]);
      })
    );
  }
  
  /**
   * Get colors by category
   * @param category Category name
   */
  getColorsByCategory(category: string): ColorToken[] {
    return this._colors().filter(c => c.category === category);
  }
  
  /**
   * Get icons by category
   * @param category Category name
   */
  getIconsByCategory(category: string): IconToken[] {
    return this._icons().filter(i => i.category === category);
  }
  
  /**
   * Get icons that represent entities
   */
  getEntityIcons(): IconToken[] {
    return this._icons().filter(i => i.entity !== null);
  }
  
  /**
   * Find a color by token name
   * @param token Token name
   */
  findColor(token: string): ColorToken | undefined {
    return this._colors().find(c => c.token === token);
  }
  
  /**
   * Find an icon by name
   * @param name Icon name
   */
  findIcon(name: string): IconToken | undefined {
    return this._icons().find(i => i.name === name);
  }
  
  /**
   * Get VDC icons by category
   * @param category Category name
   */
  getVdcIconsByCategory(category: string): VdcIconConcept[] {
    return this._vdcIcons().filter(i => i.category === category);
  }
  
  /**
   * Find a VDC icon concept by name
   * @param name Icon concept name
   */
  findVdcIcon(name: string): VdcIconConcept | undefined {
    return this._vdcIcons().find(i => i.name === name);
  }
}
