import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './shared/layouts/shell-layout';
import { ChromelessLayoutComponent } from './shared/layouts/chromeless-layout';

export const routes: Routes = [
  // Chromeless routes (no navigation, opens in new tab)
  // These must be BEFORE the shell layout to avoid being caught by the empty path
  
  // Side Nav Demo - specific route (loads full navigation component)
  {
    path: 'simulate/side-nav-demo',
    loadComponent: () => import('./features/mockups/side-nav-demo/design/design.component')
      .then(m => m.SideNavDemoDesignComponent)
  },
  // Generic simulate route for other mockups
  {
    path: 'simulate/:slug',
    component: ChromelessLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/mockups/mockup-simulate.routes')
          .then(m => m.MOCKUP_SIMULATE_ROUTES)
      }
    ]
  },

  // Shell routes (with side navigation)
  {
    path: '',
    component: ShellLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'style-guide/palettes',
        pathMatch: 'full'
      },
      // Mockups
      {
        path: 'mockups/:slug',
        loadChildren: () => import('./features/mockups/mockup-shell.routes')
          .then(m => m.MOCKUP_SHELL_ROUTES)
      },
      // Style Guide
      {
        path: 'style-guide',
        loadChildren: () => import('./features/style-guide/style-guide.routes')
          .then(m => m.STYLE_GUIDE_ROUTES)
      },
      // Components
      {
        path: 'components',
        loadChildren: () => import('./features/component-explorer/explorer.routes')
          .then(m => m.EXPLORER_ROUTES)
      },
      // Icons
      {
        path: 'icons',
        loadChildren: () => import('./features/vdc-icons/vdc-icons.routes')
          .then(m => m.VDC_ICONS_ROUTES)
      },
      // Legacy redirects
      {
        path: 'dashboard',
        redirectTo: 'style-guide/palettes',
        pathMatch: 'full'
      },
      {
        path: 'explorer',
        redirectTo: 'components',
        pathMatch: 'full'
      },
      {
        path: 'vdc-icons',
        redirectTo: 'icons/vdc-entities',
        pathMatch: 'full'
      }
    ]
  },
  
  // Fallback
  {
    path: '**',
    redirectTo: 'style-guide/palettes'
  }
];
