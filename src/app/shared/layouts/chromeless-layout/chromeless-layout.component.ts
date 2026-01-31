import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Chromeless layout for mockup simulation.
 * No navigation, no shell - just the mockup content.
 * Used when mockup is launched in a new tab via /simulate/:slug
 */
@Component({
  selector: 'app-chromeless-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="chromeless">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .chromeless {
      min-height: 100vh;
      background-color: var(--vdc-surface-200);
    }
  `]
})
export class ChromelessLayoutComponent {}
