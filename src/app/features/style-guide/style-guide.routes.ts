import { Routes } from '@angular/router';
import { ColorSystemComponent } from './color-system/color-system.component';
import { IconographyComponent } from './iconography/iconography.component';

export const STYLE_GUIDE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'colors',
    pathMatch: 'full'
  },
  {
    path: 'colors',
    component: ColorSystemComponent
  },
  {
    path: 'icons',
    component: IconographyComponent
  }
];
