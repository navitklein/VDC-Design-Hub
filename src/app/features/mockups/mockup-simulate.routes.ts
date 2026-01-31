import { Routes } from '@angular/router';
import { DesignComponent } from './_template/design/design.component';

/**
 * Simulate routes for mockup features (chromeless, new tab)
 * Design view is shown without any navigation shell
 * 
 * Note: Specific mockups like side-nav-demo have their own routes in app.routes.ts
 */
export const MOCKUP_SIMULATE_ROUTES: Routes = [
  {
    path: '',
    component: DesignComponent
  }
];
