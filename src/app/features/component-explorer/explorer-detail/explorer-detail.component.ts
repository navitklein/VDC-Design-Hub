import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownLoaderService } from '../../../core/services/markdown-loader.service';

// Import VDC Library components for demo
import { VdcButtonComponent } from '../../../vdc-library/vdc-button';
import { VdcDropdownComponent } from '../../../vdc-library/vdc-dropdown';
import { VdcFormFieldComponent } from '../../../vdc-library/vdc-form-field';

/**
 * Explorer Detail Component - Shows a single VDC component with docs
 */
@Component({
  selector: 'app-explorer-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MarkdownModule,
    VdcButtonComponent,
    VdcDropdownComponent,
    VdcFormFieldComponent
  ],
  template: `
    <div class="explorer-detail">
      <!-- Back Link -->
      <a routerLink="/explorer" class="explorer-detail__back">
        <i class="fa-solid fa-arrow-left"></i>
        Back to Components
      </a>

      <div class="explorer-detail__content">
        <!-- Left: Component Demo -->
        <div class="explorer-detail__demo">
          <h2 class="vdc-heading-2">{{ componentSlug | titlecase }}</h2>
          
          <div class="explorer-detail__demo-area">
            @switch (componentSlug) {
              @case ('vdc-button') {
                <div class="demo-section">
                  <h3>Variants</h3>
                  <div class="demo-row">
                    <vdc-button variant="primary">Primary</vdc-button>
                    <vdc-button variant="secondary">Secondary</vdc-button>
                    <vdc-button variant="destructive">Destructive</vdc-button>
                    <vdc-button variant="ghost">Ghost</vdc-button>
                  </div>
                </div>
                <div class="demo-section">
                  <h3>With Icons</h3>
                  <div class="demo-row">
                    <vdc-button variant="primary" icon="fa-plus">Add Item</vdc-button>
                    <vdc-button variant="secondary" icon="fa-download">Download</vdc-button>
                    <vdc-button variant="destructive" icon="fa-trash">Delete</vdc-button>
                  </div>
                </div>
                <div class="demo-section">
                  <h3>Sizes</h3>
                  <div class="demo-row">
                    <vdc-button size="small">Small</vdc-button>
                    <vdc-button size="medium">Medium</vdc-button>
                    <vdc-button size="large">Large</vdc-button>
                  </div>
                </div>
                <div class="demo-section">
                  <h3>Disabled</h3>
                  <div class="demo-row">
                    <vdc-button variant="primary" [disabled]="true">Disabled</vdc-button>
                  </div>
                </div>
              }
              @case ('vdc-dropdown') {
                <div class="demo-section">
                  <h3>Basic Dropdown</h3>
                  <vdc-dropdown
                    [data]="dropdownOptions"
                    placeholder="Select an option"
                    label="Choose an option"
                    style="width: 250px;">
                  </vdc-dropdown>
                </div>
                <div class="demo-section">
                  <h3>With Hint</h3>
                  <vdc-dropdown
                    [data]="dropdownOptions"
                    placeholder="Select..."
                    label="Status"
                    hint="Select the current status"
                    style="width: 250px;">
                  </vdc-dropdown>
                </div>
                <div class="demo-section">
                  <h3>Loading State</h3>
                  <vdc-dropdown
                    [data]="[]"
                    [loading]="true"
                    placeholder="Loading..."
                    label="Loading Dropdown"
                    style="width: 250px;">
                  </vdc-dropdown>
                </div>
              }
              @case ('vdc-form-field') {
                <div class="demo-section">
                  <h3>Basic Input</h3>
                  <vdc-form-field
                    label="Full Name"
                    placeholder="Enter your name"
                    style="width: 300px;">
                  </vdc-form-field>
                </div>
                <div class="demo-section">
                  <h3>With Icon</h3>
                  <vdc-form-field
                    label="Email Address"
                    placeholder="email@example.com"
                    icon="fa-envelope"
                    style="width: 300px;">
                  </vdc-form-field>
                </div>
                <div class="demo-section">
                  <h3>With Hint</h3>
                  <vdc-form-field
                    label="Password"
                    placeholder="Enter password"
                    hint="Must be at least 8 characters"
                    icon="fa-lock"
                    style="width: 300px;">
                  </vdc-form-field>
                </div>
                <div class="demo-section">
                  <h3>With Error</h3>
                  <vdc-form-field
                    label="Username"
                    placeholder="Enter username"
                    error="Username is already taken"
                    style="width: 300px;">
                  </vdc-form-field>
                </div>
              }
              @default {
                <div class="vdc-empty-state">
                  <i class="fa-solid fa-cube vdc-empty-state__icon"></i>
                  <h3 class="vdc-empty-state__title">Component Demo</h3>
                  <p class="vdc-empty-state__description">
                    Demo not yet implemented for this component
                  </p>
                </div>
              }
            }
          </div>
        </div>

        <!-- Right: Documentation -->
        <div class="explorer-detail__docs">
          <h2 class="vdc-heading-2">Documentation</h2>
          
          @if (loading()) {
            <div class="explorer-detail__loading">
              <div class="vdc-skeleton" style="height: 24px; width: 60%; margin-bottom: 16px;"></div>
              <div class="vdc-skeleton" style="height: 16px; width: 100%; margin-bottom: 8px;"></div>
              <div class="vdc-skeleton" style="height: 16px; width: 90%; margin-bottom: 8px;"></div>
              <div class="vdc-skeleton" style="height: 16px; width: 80%;"></div>
            </div>
          }

          @if (!loading() && content()) {
            <div class="explorer-detail__markdown">
              <markdown [data]="content()"></markdown>
            </div>
          }

          @if (!loading() && !content()) {
            <div class="explorer-detail__no-docs">
              <p class="vdc-caption">
                No documentation available yet. 
                Create a markdown file at <code>/content/components/{{ componentSlug }}.md</code>
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .explorer-detail {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .explorer-detail__back {
      display: inline-flex;
      align-items: center;
      gap: var(--vdc-space-xs);
      color: var(--vdc-text-secondary);
      text-decoration: none;
      font-size: var(--vdc-font-size-sm);

      &:hover {
        color: var(--vdc-primary);
      }
    }

    .explorer-detail__content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--vdc-space-xl);
    }

    @media (max-width: 1024px) {
      .explorer-detail__content {
        grid-template-columns: 1fr;
      }
    }

    .explorer-detail__demo,
    .explorer-detail__docs {
      background-color: var(--vdc-surface-100);
      padding: var(--vdc-space-lg);
      border-radius: var(--vdc-radius-lg);

      h2 {
        margin: 0 0 var(--vdc-space-lg);
        padding-bottom: var(--vdc-space-sm);
        border-bottom: 1px solid var(--vdc-border-subtle);
      }
    }

    .explorer-detail__demo-area {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .demo-section {
      h3 {
        font-size: var(--vdc-font-size-sm);
        font-weight: var(--vdc-font-weight-semibold);
        color: var(--vdc-text-secondary);
        margin: 0 0 var(--vdc-space-sm);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .demo-row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--vdc-space-sm);
      align-items: center;
    }

    .explorer-detail__markdown {
      ::ng-deep {
        h1, h2, h3 {
          color: var(--vdc-text-primary);
        }
        
        p, li {
          color: var(--vdc-text-secondary);
          line-height: var(--vdc-line-height-relaxed);
        }

        code {
          background-color: var(--vdc-surface-300);
          padding: 2px 6px;
          border-radius: var(--vdc-radius-sm);
        }

        pre {
          background-color: var(--vdc-surface-200);
          padding: var(--vdc-space-md);
          border-radius: var(--vdc-radius-md);
          overflow-x: auto;
        }
      }
    }

    .explorer-detail__no-docs {
      padding: var(--vdc-space-lg);
      background-color: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-md);

      code {
        background-color: var(--vdc-surface-300);
        padding: 2px 6px;
        border-radius: var(--vdc-radius-sm);
        font-size: var(--vdc-font-size-sm);
      }
    }
  `]
})
export class ExplorerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly markdownLoader = inject(MarkdownLoaderService);
  
  readonly loading = signal(true);
  readonly content = signal<string>('');
  
  componentSlug = '';
  
  // Demo data
  dropdownOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  
  ngOnInit(): void {
    this.componentSlug = this.route.snapshot.paramMap.get('componentName') || '';
    
    this.markdownLoader.loadComponentDocs(this.componentSlug).subscribe({
      next: (content) => {
        this.content.set(content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
