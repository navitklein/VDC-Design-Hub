import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './shared/layouts/shell-layout';
import { ChromelessLayoutComponent } from './shared/layouts/chromeless-layout';

export const routes: Routes = [
  // Shell routes (with navigation)
  {
    path: '',
    component: ShellLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes')
          .then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'style-guide',
        loadChildren: () => import('./features/style-guide/style-guide.routes')
          .then(m => m.STYLE_GUIDE_ROUTES)
      },
      {
        path: 'explorer',
        loadChildren: () => import('./features/component-explorer/explorer.routes')
          .then(m => m.EXPLORER_ROUTES)
      },
      {
        path: 'mockups/:slug',
        loadChildren: () => import('./features/mockups/mockup-shell.routes')
          .then(m => m.MOCKUP_SHELL_ROUTES)
      }
    ]
  },
  
  // Chromeless routes (no navigation, opens in new tab)
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
  
  // Fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
