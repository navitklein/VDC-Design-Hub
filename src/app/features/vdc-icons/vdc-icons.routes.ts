import { Routes } from '@angular/router';
import { VdcIconsComponent } from './vdc-icons.component';

export const VDC_ICONS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'vdc-entities',
    pathMatch: 'full'
  },
  {
    path: 'vdc-entities',
    component: VdcIconsComponent,
    data: { category: 'VDC Entities' }
  },
  {
    path: 'navigation',
    component: VdcIconsComponent,
    data: { category: 'Navigation' }
  },
  {
    path: 'vdc-actions',
    component: VdcIconsComponent,
    data: { category: 'VDC Actions' }
  },
  {
    path: 'status',
    component: VdcIconsComponent,
    data: { category: 'Status' }
  },
  {
    path: 'other',
    component: VdcIconsComponent,
    data: { category: 'Other' }
  }
];
