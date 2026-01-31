import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';

/**
 * Service for loading markdown content at runtime.
 * Used for identity pages and component documentation.
 */
@Injectable({
  providedIn: 'root'
})
export class MarkdownLoaderService {
  private readonly http = inject(HttpClient);
  
  /** Cache for loaded markdown content */
  private cache = new Map<string, string>();
  
  /**
   * Load markdown content from a path
   * @param path Path to the markdown file (relative to content folder)
   * @returns Observable of the markdown content string
   */
  load(path: string): Observable<string> {
    // Check cache first
    const cached = this.cache.get(path);
    if (cached) {
      return of(cached);
    }
    
    // Ensure path starts with /content/
    const fullPath = path.startsWith('/content/') ? path : `/content/${path}`;
    
    return this.http.get(fullPath, { responseType: 'text' }).pipe(
      map(content => {
        // Cache the content
        this.cache.set(path, content);
        return content;
      }),
      catchError(err => {
        console.error(`Error loading markdown from ${path}:`, err);
        return of(`# Content Not Found\n\nThe content at \`${path}\` could not be loaded.`);
      })
    );
  }
  
  /**
   * Load markdown for a mockup's identity page
   * @param slug The mockup slug
   */
  loadIdentity(slug: string): Observable<string> {
    return this.load(`mockups/${slug}/identity.md`);
  }
  
  /**
   * Load markdown for a component's documentation
   * @param componentSlug The component slug
   */
  loadComponentDocs(componentSlug: string): Observable<string> {
    return this.load(`components/${componentSlug}.md`);
  }
  
  /**
   * Load markdown for style guide pages
   * @param page The style guide page (e.g., 'colors', 'icons')
   */
  loadStyleGuide(page: string): Observable<string> {
    return this.load(`style-guide/${page}.md`);
  }
  
  /**
   * Clear the cache (useful for development)
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Clear a specific path from cache
   * @param path Path to clear
   */
  clearCachePath(path: string): void {
    this.cache.delete(path);
  }
}
