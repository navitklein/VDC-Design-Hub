import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { FeatureRegistryService } from '../../core/services/feature-registry.service';
import { Feature, FeatureStatus } from '../../core/models';
import { FeatureCardComponent } from './feature-card/feature-card.component';

interface StatusFilter {
  value: FeatureStatus | 'all';
  label: string;
}

/**
 * Dashboard Component - Gallery of all mockup features
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonsModule,
    DropDownListModule,
    InputsModule,
    FeatureCardComponent
  ],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dashboard__header">
        <div class="dashboard__title-section">
          <h1 class="vdc-heading-1">Mockup Gallery</h1>
          <p class="vdc-caption">Browse and access all VDC feature mockups</p>
        </div>

        <div class="dashboard__filters">
          <!-- Search -->
          <kendo-textbox
            [value]="searchQuery()"
            (valueChange)="onSearchChange($event)"
            placeholder="Search mockups..."
            class="dashboard__search">
            <ng-template kendoTextBoxPrefixTemplate>
              <i class="fa-solid fa-search"></i>
            </ng-template>
          </kendo-textbox>

          <!-- Status Filter -->
          <kendo-dropdownlist
            [data]="statusFilters"
            [value]="selectedStatus()"
            textField="label"
            valueField="value"
            (valueChange)="onStatusChange($event)"
            class="dashboard__status-filter">
          </kendo-dropdownlist>
        </div>
      </header>

      <!-- Loading State -->
      @if (loading()) {
        <div class="dashboard__loading">
          <div class="vdc-skeleton" style="height: 200px; margin-bottom: 16px;"></div>
          <div class="vdc-skeleton" style="height: 200px; margin-bottom: 16px;"></div>
          <div class="vdc-skeleton" style="height: 200px;"></div>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && filteredFeatures().length === 0) {
        <div class="vdc-empty-state">
          <i class="fa-solid fa-folder-open vdc-empty-state__icon"></i>
          <h3 class="vdc-empty-state__title">No mockups found</h3>
          <p class="vdc-empty-state__description">
            @if (searchQuery() || selectedStatus().value !== 'all') {
              Try adjusting your filters
            } @else {
              No mockups have been created yet
            }
          </p>
        </div>
      }

      <!-- Feature Grid -->
      @if (!loading() && filteredFeatures().length > 0) {
        <div class="dashboard__grid">
          @for (feature of filteredFeatures(); track feature.slug) {
            <app-feature-card [feature]="feature"></app-feature-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .dashboard__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: var(--vdc-space-md);
    }

    .dashboard__title-section {
      h1 {
        margin: 0 0 var(--vdc-space-xs);
      }
      p {
        margin: 0;
      }
    }

    .dashboard__filters {
      display: flex;
      gap: var(--vdc-space-md);
      align-items: center;
    }

    .dashboard__search {
      width: 250px;
    }

    .dashboard__status-filter {
      width: 150px;
    }

    .dashboard__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--vdc-space-lg);
    }

    .dashboard__loading {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--vdc-space-lg);
    }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly featureRegistry = inject(FeatureRegistryService);
  
  /** Loading state */
  readonly loading = this.featureRegistry.loading;
  
  /** Search query */
  readonly searchQuery = signal('');
  
  /** Status filter options */
  readonly statusFilters: StatusFilter[] = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'In Review' },
    { value: 'ready', label: 'Ready for Dev' }
  ];
  
  /** Selected status filter */
  readonly selectedStatus = signal<StatusFilter>(this.statusFilters[0]);
  
  /** Filtered features based on search and status */
  readonly filteredFeatures = computed(() => {
    let features = this.featureRegistry.features();
    
    // Filter by status
    const status = this.selectedStatus().value;
    if (status !== 'all') {
      features = features.filter(f => f.status === status);
    }
    
    // Filter by search query
    const query = this.searchQuery().toLowerCase();
    if (query) {
      features = features.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.tags.some(t => t.toLowerCase().includes(query))
      );
    }
    
    return features;
  });
  
  ngOnInit(): void {
    this.featureRegistry.loadFeatures().subscribe();
  }
  
  onSearchChange(value: string): void {
    this.searchQuery.set(value || '');
  }
  
  onStatusChange(filter: StatusFilter): void {
    this.selectedStatus.set(filter);
  }
}
