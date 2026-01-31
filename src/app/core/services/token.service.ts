import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, forkJoin, map } from 'rxjs';
import { 
  ColorToken, 
  ColorsFile, 
  ColorCategory,
  IconToken, 
  IconsFile, 
  IconCategory 
} from '../models';

/**
 * Service for loading and managing design tokens (colors, icons).
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly http = inject(HttpClient);
  
  // Color state
  private readonly _colors = signal<ColorToken[]>([]);
  private readonly _colorCategories = signal<ColorCategory[]>([]);
  readonly colors = this._colors.asReadonly();
  readonly colorCategories = this._colorCategories.asReadonly();
  
  // Icon state
  private readonly _icons = signal<IconToken[]>([]);
  private readonly _iconCategories = signal<IconCategory[]>([]);
  readonly icons = this._icons.asReadonly();
  readonly iconCategories = this._iconCategories.asReadonly();
  
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
   * Load color tokens
   */
  loadColors(): Observable<ColorToken[]> {
    return this.http.get<ColorsFile>('/assets/tokens/colors.json').pipe(
      tap(data => {
        this._colors.set(data.colors);
        this._colorCategories.set(data.categories);
      }),
      map(data => data.colors),
      catchError(err => {
        console.error('Error loading colors:', err);
        return of([]);
      })
    );
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
}
