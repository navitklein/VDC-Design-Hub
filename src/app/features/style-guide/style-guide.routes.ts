import { Routes } from '@angular/router';
import { PalettesComponent } from './palettes/palettes.component';
import { SemanticColorsComponent } from './semantic/semantic-colors.component';
import { VdcColorsComponent } from './vdc-colors/vdc-colors.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';

export const STYLE_GUIDE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'palettes',
    pathMatch: 'full'
  },
  {
    path: 'palettes',
    component: PalettesComponent
  },
  {
    path: 'semantic',
    component: SemanticColorsComponent
  },
  {
    path: 'vdc-colors',
    component: VdcColorsComponent
  },
  {
    path: 'guidelines',
    component: GuidelinesComponent
  }
];
