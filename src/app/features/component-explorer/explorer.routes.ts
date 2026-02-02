import { Routes } from '@angular/router';
import { ExplorerListComponent } from './explorer-list/explorer-list.component';
import { ExplorerDetailComponent } from './explorer-detail/explorer-detail.component';
import { GeneralGuidelinesComponent } from './general-guidelines/general-guidelines.component';

export const EXPLORER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    component: ExplorerListComponent
  },
  {
    path: 'guidelines',
    component: GeneralGuidelinesComponent
  },
  {
    path: ':componentName',
    component: ExplorerDetailComponent
  }
];
