import { Injectable, signal, computed } from '@angular/core';
import {
  NavContextType,
  NavState,
  NavProject,
  ThemeType,
  NavUserProfile,
} from './vdc-side-nav.models';

/**
 * VDC Side Navigation Service
 * Manages navigation state using Angular signals
 */
@Injectable({
  providedIn: 'root',
})
export class VdcSideNavService {
  // -------------------------------------------------------------------------
  // State Signals
  // -------------------------------------------------------------------------

  /** Current active context */
  private readonly _activeContext = signal<NavContextType>('global');

  /** Currently selected project (null = show project browser) */
  private readonly _selectedProject = signal<NavProject | null>(null);

  /** Previous project (for cancel switch functionality) */
  private readonly _previousProject = signal<NavProject | null>(null);

  /** Current active navigation item ID */
  private readonly _activeItemId = signal<string | null>(null);

  /** Current theme */
  private readonly _theme = signal<ThemeType>('light');

  /** Current user profile */
  private readonly _userProfile = signal<NavUserProfile>({
    name: 'User',
    email: 'user@intel.com',
    initials: 'U',
  });

  /** Whether the content panel is expanded */
  private readonly _isPanelExpanded = signal<boolean>(true);

  // -------------------------------------------------------------------------
  // Public Readonly Signals
  // -------------------------------------------------------------------------

  readonly activeContext = this._activeContext.asReadonly();
  readonly selectedProject = this._selectedProject.asReadonly();
  readonly previousProject = this._previousProject.asReadonly();
  readonly activeItemId = this._activeItemId.asReadonly();
  readonly theme = this._theme.asReadonly();
  readonly userProfile = this._userProfile.asReadonly();
  readonly isPanelExpanded = this._isPanelExpanded.asReadonly();

  // -------------------------------------------------------------------------
  // Computed Signals
  // -------------------------------------------------------------------------

  /** Whether we're in project context with a selected project */
  readonly isInProjectContext = computed(
    () =>
      this._activeContext() === 'project' && this._selectedProject() !== null
  );

  /** Whether we're showing the project browser */
  readonly isShowingProjectBrowser = computed(
    () =>
      this._activeContext() === 'project' && this._selectedProject() === null
  );

  /** Whether we're in the process of switching projects (has a previous project to return to) */
  readonly isSwitchingProject = computed(
    () =>
      this.isShowingProjectBrowser() && this._previousProject() !== null
  );

  /** Full navigation state */
  readonly state = computed<NavState>(() => ({
    activeContext: this._activeContext(),
    selectedProject: this._selectedProject(),
    activeItemId: this._activeItemId(),
    theme: this._theme(),
  }));

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  /**
   * Set the active navigation context
   */
  setActiveContext(context: NavContextType): void {
    this._activeContext.set(context);
    // Reset active item when changing context
    this._activeItemId.set(null);
  }

  /**
   * Select a project (switches to project context view)
   */
  selectProject(project: NavProject): void {
    this._selectedProject.set(project);
    this._previousProject.set(null); // Clear previous project when selecting a new one
    this._activeItemId.set(null);
  }

  /**
   * Clear selected project (return to project browser for switching)
   */
  clearSelectedProject(): void {
    // Save current project as previous so user can cancel
    this._previousProject.set(this._selectedProject());
    this._selectedProject.set(null);
    this._activeItemId.set(null);
  }

  /**
   * Cancel project switch and return to previous project
   */
  cancelProjectSwitch(): void {
    if (this._previousProject()) {
      this._selectedProject.set(this._previousProject());
      this._previousProject.set(null);
    }
  }

  /**
   * Set the active navigation item
   */
  setActiveItem(itemId: string): void {
    this._activeItemId.set(itemId);
  }

  /**
   * Toggle theme between light and dark
   */
  toggleTheme(): void {
    this._theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  /**
   * Set theme explicitly
   */
  setTheme(theme: ThemeType): void {
    this._theme.set(theme);
  }

  /**
   * Update user profile
   */
  setUserProfile(profile: NavUserProfile): void {
    this._userProfile.set(profile);
  }

  /**
   * Toggle panel expansion
   */
  togglePanelExpansion(): void {
    this._isPanelExpanded.update((current) => !current);
  }

  /**
   * Set panel expansion state
   */
  setPanelExpanded(expanded: boolean): void {
    this._isPanelExpanded.set(expanded);
  }
}
