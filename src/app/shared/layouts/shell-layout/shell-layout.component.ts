import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

/**
 * Main application shell with navigation.
 * Used for Dashboard, Style Guide, Component Explorer, and Feature Identity/Spec views.
 */
@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonsModule],
  template: `
    <div class="shell">
      <!-- Header -->
      <header class="shell__header">
        <div class="shell__header-content">
          <!-- Logo & Title -->
          <a routerLink="/dashboard" class="shell__logo">
            <i class="fa-solid fa-palette"></i>
            <span class="shell__title">VDC Design Hub</span>
          </a>

          <!-- Navigation -->
          <nav class="shell__nav">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="shell__nav-link--active"
              class="shell__nav-link">
              <i class="fa-solid fa-th-large"></i>
              Dashboard
            </a>
            <a 
              routerLink="/style-guide" 
              routerLinkActive="shell__nav-link--active"
              class="shell__nav-link">
              <i class="fa-solid fa-swatchbook"></i>
              Style Guide
            </a>
            <a 
              routerLink="/explorer" 
              routerLinkActive="shell__nav-link--active"
              class="shell__nav-link">
              <i class="fa-solid fa-cubes"></i>
              Components
            </a>
            <a 
              routerLink="/vdc-icons" 
              routerLinkActive="shell__nav-link--active"
              class="shell__nav-link">
              <i class="fa-regular fa-icons"></i>
              VDC Icons
            </a>
          </nav>

          <!-- Actions -->
          <div class="shell__actions">
            <button kendoButton look="flat" title="Help">
              <i class="fa-solid fa-question-circle"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="shell__main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--vdc-surface-200);
    }

    .shell__header {
      background-color: var(--vdc-surface-100);
      border-bottom: 1px solid var(--vdc-border-subtle);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .shell__header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 var(--vdc-space-lg);
      height: 56px;
    }

    .shell__logo {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
      text-decoration: none;
      color: var(--vdc-primary);
      font-size: var(--vdc-font-size-lg);
      font-weight: var(--vdc-font-weight-semibold);

      i {
        font-size: 24px;
      }
    }

    .shell__title {
      color: var(--vdc-text-primary);
    }

    .shell__nav {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-xs);
    }

    .shell__nav-link {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-xs);
      padding: var(--vdc-space-sm) var(--vdc-space-md);
      text-decoration: none;
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-md);
      border-radius: var(--vdc-radius-md);
      transition: all 0.15s ease;

      &:hover {
        background-color: var(--vdc-surface-300);
        color: var(--vdc-text-primary);
      }

      &--active {
        background-color: var(--vdc-primary);
        color: var(--vdc-text-inverse) !important;

        &:hover {
          background-color: var(--vdc-primary-hover);
        }
      }

      i {
        font-size: 16px;
      }
    }

    .shell__actions {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);
    }

    .shell__main {
      flex: 1;
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
      padding: var(--vdc-space-lg);
    }
  `]
})
export class ShellLayoutComponent {}
