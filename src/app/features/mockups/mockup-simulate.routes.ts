import { Routes } from '@angular/router';
import { DesignComponent } from './_template/design/design.component';

/**
 * Simulate routes for mockup features (chromeless, new tab)
 * Design view is shown without any navigation shell
 */
export const MOCKUP_SIMULATE_ROUTES: Routes = [
  {
    path: '',
    component: DesignComponent
  }
];
