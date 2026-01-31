import { Routes } from '@angular/router';
import { FeatureLayoutComponent } from '../../shared/layouts/feature-layout';
import { IdentityComponent } from './_template/identity/identity.component';
import { SpecComponent } from './_template/component-spec/spec.component';

/**
 * Shell routes for mockup features (with navigation shell)
 * Identity and Component Spec views are shown within the shell layout
 */
export const MOCKUP_SHELL_ROUTES: Routes = [
  {
    path: '',
    component: FeatureLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'identity',
        pathMatch: 'full'
      },
      {
        path: 'identity',
        component: IdentityComponent
      },
      {
        path: 'spec',
        component: SpecComponent
      }
    ]
  }
];
