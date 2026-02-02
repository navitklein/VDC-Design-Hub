import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KENDO_CHIPLIST } from '@progress/kendo-angular-buttons';
import { TokenService } from '../../../core/services/token.service';

/**
 * Guidelines Component - Shows usage guidelines tables
 */
@Component({
  selector: 'app-guidelines',
  standalone: true,
  imports: [CommonModule, KENDO_CHIPLIST],
  template: `
    <div class="guidelines-view">
      <header class="guidelines-view__header">
        <h1 class="vdc-heading-1">Usage Guidelines</h1>
        <p class="vdc-caption">How to apply colors correctly across different components</p>
      </header>

      <!-- Filter Chips -->
      <div class="guidelines-view__filters">
        <kendo-chiplist [selection]="'single'">
          @for (section of sectionOptions; track section.id) {
            <kendo-chip 
              [label]="section.label"
              [size]="'large'"
              [rounded]="'full'"
              [selected]="selectedSection() === section.id"
              (contentClick)="onSectionSelect(section.id)">
            </kendo-chip>
          }
        </kendo-chiplist>
      </div>

      @if (loading()) {
        <div class="guidelines-view__loading">
          <div class="vdc-skeleton" style="height: 300px;"></div>
        </div>
      }

      @if (!loading()) {
        <div class="guidelines">
          <!-- Surfaces Section -->
          @if (selectedSection() === 'all' || selectedSection() === 'surfaces') {
            <section class="guidelines__section">
              <h2 class="guidelines__title">
                <i class="fa-solid fa-layer-group"></i> Surface Colors
              </h2>
              <p class="guidelines__desc">Which surface token to use for each component type</p>
              
              <div class="guidelines__table-wrapper">
                <table class="guidelines__table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Light Theme</th>
                      <th>Dark Theme</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (rule of surfaceRules(); track rule.component) {
                      <tr>
                        <td class="cell-component">{{ rule.component }}</td>
                        <td class="cell-token">
                          <span class="color-dot" [style.background-color]="getColorHex(rule.light, 'light')"></span>
                          <code>{{ rule.light }}</code>
                        </td>
                        <td class="cell-token">
                          <span class="color-dot color-dot--dark" [style.background-color]="getColorHex(rule.dark, 'dark')"></span>
                          <code>{{ rule.dark }}</code>
                        </td>
                        <td class="cell-notes">{{ rule.notes }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          <!-- Text Colors Section -->
          @if (selectedSection() === 'all' || selectedSection() === 'text') {
            <section class="guidelines__section">
              <h2 class="guidelines__title">
                <i class="fa-solid fa-font"></i> Text Colors
              </h2>
              <p class="guidelines__desc">Guidelines for choosing text colors</p>
              
              <div class="guidelines__table-wrapper">
                <table class="guidelines__table">
                  <thead>
                    <tr>
                      <th>Use Case</th>
                      <th>Token (Light)</th>
                      <th>Token (Dark)</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (rule of textRules(); track rule.use) {
                      <tr>
                        <td class="cell-component">{{ rule.use }}</td>
                        <td class="cell-token">
                          <span class="color-dot" [style.background-color]="getColorHex(rule.token, 'light')"></span>
                          <code>{{ rule.token }}</code>
                        </td>
                        <td class="cell-token">
                          <span class="color-dot color-dot--dark" [style.background-color]="getColorHex(rule.token, 'dark')"></span>
                          <code>{{ rule.token }}</code>
                        </td>
                        <td class="cell-notes">{{ rule.notes }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          <!-- Border Colors Section -->
          @if (selectedSection() === 'all' || selectedSection() === 'borders') {
            <section class="guidelines__section">
              <h2 class="guidelines__title">
                <i class="fa-solid fa-border-all"></i> Border Colors
              </h2>
              <p class="guidelines__desc">Guidelines for border usage</p>
              
              <div class="guidelines__table-wrapper">
                <table class="guidelines__table">
                  <thead>
                    <tr>
                      <th>Use Case</th>
                      <th>Token (Light)</th>
                      <th>Token (Dark)</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (rule of borderRules(); track rule.use) {
                      <tr>
                        <td class="cell-component">{{ rule.use }}</td>
                        <td class="cell-token">
                          <span class="color-dot" [style.background-color]="getColorHex(rule.token, 'light')"></span>
                          <code>{{ rule.token }}</code>
                        </td>
                        <td class="cell-token">
                          <span class="color-dot color-dot--dark" [style.background-color]="getColorHex(rule.token, 'dark')"></span>
                          <code>{{ rule.token }}</code>
                        </td>
                        <td class="cell-notes">{{ rule.notes }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          <!-- Interactive States Section -->
          @if (selectedSection() === 'all' || selectedSection() === 'states') {
            <section class="guidelines__section">
              <h2 class="guidelines__title">
                <i class="fa-solid fa-hand-pointer"></i> Interactive States
              </h2>
              <p class="guidelines__desc">State patterns for interactive elements</p>
              
              <div class="guidelines__table-wrapper">
                <table class="guidelines__table">
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Background</th>
                      <th>Text</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (rule of stateRules(); track rule.state) {
                      <tr>
                        <td class="cell-component">{{ rule.state }}</td>
                        <td class="cell-token">
                          <span class="color-dot" [style.background-color]="getColorHex(rule.background, 'light')"></span>
                          <code>{{ rule.background }}</code>
                        </td>
                        <td class="cell-token">
                          <span class="color-dot" [style.background-color]="getColorHex(rule.text, 'light')"></span>
                          <code>{{ rule.text }}</code>
                        </td>
                        <td class="cell-notes">{{ rule.notes }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          <!-- Focus Ring Section -->
          @if (selectedSection() === 'all' || selectedSection() === 'focus') {
            <section class="guidelines__section">
              <h2 class="guidelines__title">
                <i class="fa-solid fa-bullseye"></i> Focus Ring
              </h2>
              <p class="guidelines__desc">Keyboard accessibility focus indicators for interactive elements</p>
              
              <div class="guidelines__table-wrapper">
                <table class="guidelines__table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Focus Color</th>
                      <th>CSS Properties</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (rule of focusRules; track rule.component) {
                      <tr>
                        <td class="cell-component">{{ rule.component }}</td>
                        <td class="cell-token">
                          <span class="color-dot" [style.background-color]="rule.colorHex"></span>
                          <code>{{ rule.color }}</code>
                        </td>
                        <td class="cell-code">
                          <code>{{ rule.css }}</code>
                        </td>
                        <td class="cell-notes">{{ rule.notes }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <div class="guidelines__info-box">
                <h3><i class="fa-solid fa-circle-info"></i> Important</h3>
                <ul>
                  <li><strong>Never use <code>outline: none</code></strong> without providing an alternative focus indicator - this breaks keyboard accessibility.</li>
                  <li><strong>Always include <code>box-shadow: none</code></strong> when overriding Kendo focus styles to remove the default black shadow.</li>
                  <li>Focus rings must be visible for WCAG 2.1 compliance (Success Criterion 2.4.7).</li>
                </ul>
              </div>
            </section>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .guidelines-view {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .guidelines-view__header {
      h1 { margin: 0 0 var(--vdc-space-xs); }
      p { margin: 0; }
    }

    .guidelines-view__filters {
      margin-bottom: var(--vdc-space-md);
    }

    .guidelines-view__loading {
      padding: var(--vdc-space-lg);
    }

    .guidelines {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-xl);
    }

    .guidelines__section {
      background: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      padding: var(--vdc-space-lg);
      box-shadow: var(--vdc-shadow-sm);
    }

    .guidelines__title {
      margin: 0 0 var(--vdc-space-xs);
      font-size: var(--vdc-font-size-lg);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);

      i { color: var(--vdc-primary); }
    }

    .guidelines__desc {
      margin: 0 0 var(--vdc-space-md);
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-sm);
    }

    .guidelines__table-wrapper {
      overflow-x: auto;
    }

    .guidelines__table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--vdc-font-size-sm);

      th, td {
        padding: var(--vdc-space-sm) var(--vdc-space-md);
        text-align: left;
        border-bottom: 1px solid var(--vdc-border-subtle);
      }

      th {
        background: var(--vdc-surface-200);
        font-weight: var(--vdc-font-weight-semibold);
        color: var(--vdc-text-primary);
        white-space: nowrap;
      }

      tbody tr:hover {
        background: var(--vdc-surface-200);
      }

      .cell-component {
        font-weight: var(--vdc-font-weight-medium);
        color: var(--vdc-text-primary);
        white-space: nowrap;
      }

      .cell-token {
        display: flex;
        align-items: center;
        gap: var(--vdc-space-xs);
      }

      .cell-token code {
        background: var(--vdc-surface-300);
        padding: 2px 6px;
        border-radius: var(--vdc-radius-sm);
        font-family: monospace;
        font-size: var(--vdc-font-size-xs);
        color: var(--vdc-primary);
      }

      .cell-notes {
        color: var(--vdc-text-secondary);
      }
    }

    .color-dot {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: var(--vdc-radius-sm);
      border: 1px solid var(--vdc-border-default);
      flex-shrink: 0;
    }

    .color-dot--dark {
      box-shadow: inset 0 0 0 2px #1f1f1f;
    }

    .cell-code code {
      background: var(--vdc-surface-300);
      padding: 2px 6px;
      border-radius: var(--vdc-radius-sm);
      font-family: monospace;
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-primary);
      white-space: nowrap;
    }

    .guidelines__info-box {
      margin-top: var(--vdc-space-lg);
      padding: var(--vdc-space-md);
      background: color-mix(in srgb, var(--vdc-primary) 8%, transparent);
      border-left: 4px solid var(--vdc-primary);
      border-radius: var(--vdc-radius-md);

      h3 {
        margin: 0 0 var(--vdc-space-sm);
        font-size: var(--vdc-font-size-md);
        font-weight: var(--vdc-font-weight-semibold);
        color: var(--vdc-primary);
        display: flex;
        align-items: center;
        gap: var(--vdc-space-xs);
      }

      ul {
        margin: 0;
        padding-left: var(--vdc-space-lg);
      }

      li {
        margin-bottom: var(--vdc-space-xs);
        font-size: var(--vdc-font-size-sm);
        color: var(--vdc-text-primary);

        &:last-child {
          margin-bottom: 0;
        }
      }

      code {
        background: var(--vdc-surface-100);
        padding: 1px 4px;
        border-radius: var(--vdc-radius-sm);
        font-family: monospace;
        font-size: var(--vdc-font-size-xs);
        color: var(--vdc-error);
      }
    }
  `]
})
export class GuidelinesComponent implements OnInit {
  private readonly tokenService = inject(TokenService);
  
  readonly loading = this.tokenService.loading;
  readonly colors = this.tokenService.colors;
  readonly colorsDark = this.tokenService.colorsDark;
  readonly usageGuidelines = this.tokenService.usageGuidelines;
  
  readonly selectedSection = signal<string>('all');

  readonly sectionOptions = [
    { id: 'all', label: 'All' },
    { id: 'surfaces', label: 'Surfaces' },
    { id: 'text', label: 'Text' },
    { id: 'borders', label: 'Borders' },
    { id: 'states', label: 'States' },
    { id: 'focus', label: 'Focus' }
  ];

  // Focus ring rules (static data - not from token service)
  readonly focusRules = [
    {
      component: 'Buttons (.k-button)',
      color: 'rgba(15, 108, 189, 0.5)',
      colorHex: 'rgba(15, 108, 189, 0.5)',
      css: 'outline: 2px solid; outline-offset: 2px; box-shadow: none',
      notes: 'Semi-transparent blue on light backgrounds'
    },
    {
      component: 'Chips (.k-chip)',
      color: 'rgba(15, 108, 189, 0.5)',
      colorHex: 'rgba(15, 108, 189, 0.5)',
      css: 'outline: 2px solid; outline-offset: 2px; box-shadow: none',
      notes: 'Same as buttons for consistency'
    },
    {
      component: 'Inputs (.k-input)',
      color: 'var(--vdc-primary)',
      colorHex: '#0f6cbd',
      css: 'border-color: var(--vdc-primary); box-shadow: 0 0 0 1px',
      notes: 'Uses border highlight instead of outline'
    },
    {
      component: 'Buttons on dark backgrounds',
      color: 'rgba(255, 255, 255, 0.5)',
      colorHex: 'rgba(255, 255, 255, 0.5)',
      css: 'outline: 2px solid; outline-offset: 2px; box-shadow: none',
      notes: 'White ring for visibility on colored/dark backgrounds'
    }
  ];

  // Build a lookup map for color hex values
  private readonly colorLookup = computed(() => {
    const lightMap = new Map<string, string>();
    const darkMap = new Map<string, string>();
    
    for (const color of this.colors()) {
      lightMap.set(color.token, color.hex);
    }
    for (const color of this.colorsDark()) {
      darkMap.set(color.token, color.hex);
    }
    
    return { light: lightMap, dark: darkMap };
  });

  // Guidelines computed properties
  readonly surfaceRules = computed(() => {
    const guidelines = this.usageGuidelines();
    if (!guidelines || !guidelines['surfaces']) return [];
    return (guidelines['surfaces'] as { rules: Array<{ component: string; light: string; dark: string; notes: string }> }).rules || [];
  });
  
  readonly textRules = computed(() => {
    const guidelines = this.usageGuidelines();
    if (!guidelines || !guidelines['text']) return [];
    return (guidelines['text'] as { rules: Array<{ use: string; token: string; notes: string }> }).rules || [];
  });
  
  readonly borderRules = computed(() => {
    const guidelines = this.usageGuidelines();
    if (!guidelines || !guidelines['borders']) return [];
    return (guidelines['borders'] as { rules: Array<{ use: string; token: string; notes: string }> }).rules || [];
  });
  
  readonly stateRules = computed(() => {
    const guidelines = this.usageGuidelines();
    if (!guidelines || !guidelines['states']) return [];
    return (guidelines['states'] as { rules: Array<{ state: string; background: string; text: string; notes: string }> }).rules || [];
  });

  ngOnInit(): void {
    this.tokenService.loadColors().subscribe();
  }

  onSectionSelect(section: string): void {
    this.selectedSection.set(section);
  }

  getColorHex(tokenName: string, theme: 'light' | 'dark'): string {
    if (!tokenName) return 'transparent';
    
    const firstToken = tokenName.split('/')[0].trim();
    
    if (firstToken.includes('{')) {
      return theme === 'light' ? '#e0e0e0' : '#3d3d3d';
    }
    
    const lookup = this.colorLookup();
    const map = theme === 'light' ? lookup.light : lookup.dark;
    
    return map.get(firstToken) || 'transparent';
  }
}
