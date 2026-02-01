import { Routes } from '@angular/router';
import { ExplorerListComponent } from './explorer-list/explorer-list.component';
import { ExplorerDetailComponent } from './explorer-detail/explorer-detail.component';

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
    path: ':componentName',
    component: ExplorerDetailComponent
  }
];
