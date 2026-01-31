import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { Feature, FeaturesFile, FeatureStatus } from '../models';

/**
 * Service that manages the registry of all mockup features.
 * Loads feature data from the static JSON file.
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureRegistryService {
  private readonly http = inject(HttpClient);
  
  /** All loaded features */
  private readonly _features = signal<Feature[]>([]);
  
  /** Readonly signal for features */
  readonly features = this._features.asReadonly();
  
  /** Loading state */
  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();
  
  /** Error state */
  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();
  
  /**
   * Load all features from the JSON file
   */
  loadFeatures(): Observable<Feature[]> {
    this._loading.set(true);
    this._error.set(null);
    
    return this.http.get<FeaturesFile>('/assets/data/features.json').pipe(
      map(data => data.features),
      tap(features => {
        this._features.set(features);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Failed to load features');
        this._loading.set(false);
        console.error('Error loading features:', err);
        return of([]);
      })
    );
  }
  
  /**
   * Get all features
   */
  getAll(): Feature[] {
    return this._features();
  }
  
  /**
   * Get a feature by slug
   * @param slug The feature slug to find
   */
  getBySlug(slug: string): Feature | undefined {
    return this._features().find(f => f.slug === slug);
  }
  
  /**
   * Filter features by status
   * @param status The status to filter by
   */
  getByStatus(status: FeatureStatus): Feature[] {
    return this._features().filter(f => f.status === status);
  }
  
  /**
   * Filter features by tag
   * @param tag The tag to filter by
   */
  getByTag(tag: string): Feature[] {
    return this._features().filter(f => f.tags.includes(tag));
  }
  
  /**
   * Search features by name or description
   * @param query Search query
   */
  search(query: string): Feature[] {
    const lowerQuery = query.toLowerCase();
    return this._features().filter(f => 
      f.name.toLowerCase().includes(lowerQuery) ||
      f.description.toLowerCase().includes(lowerQuery)
    );
  }
  
  /**
   * Get all unique tags across features
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    this._features().forEach(f => f.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }
}
