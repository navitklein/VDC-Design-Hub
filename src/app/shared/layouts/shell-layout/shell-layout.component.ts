import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppSideNavComponent } from '../../components/app-side-nav';

/**
 * Main application shell with side navigation.
 * Used for all main app views: Mockups, Style Guide, Components, Icons.
 */
@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AppSideNavComponent],
  template: `
    <div class="shell">
      <!-- Side Navigation -->
      <app-side-nav></app-side-nav>

      <!-- Main Content -->
      <main class="shell__main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background-color: var(--vdc-surface-200);
    }

    .shell__main {
      flex: 1;
      padding: var(--vdc-space-lg) var(--vdc-space-xl);
      overflow-y: auto;
      height: 100vh;
    }
  `]
})
export class ShellLayoutComponent {}
