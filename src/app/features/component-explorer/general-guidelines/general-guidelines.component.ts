import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * General Guidelines Component - Cross-component design patterns and accessibility rules
 */
@Component({
  selector: 'app-general-guidelines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="general-guidelines">
      <!-- Back Link -->
      <a routerLink="/components/overview" class="general-guidelines__back">
        <i class="fa-solid fa-arrow-left"></i>
        Back to Components
      </a>

      <header class="general-guidelines__header">
        <h1 class="vdc-heading-1">General Guidelines</h1>
        <p class="vdc-caption">Cross-component design patterns and accessibility requirements</p>
      </header>

      <!-- Focus Ring Section -->
      <section class="guidelines-section">
        <h2 class="guidelines-section__title">
          <i class="fa-solid fa-bullseye"></i> Focus Ring Styling
        </h2>
        <p class="guidelines-section__desc">
          VDC uses a subtle semi-transparent blue focus ring instead of the default Kendo Fluent black focus ring.
          This provides clear keyboard navigation feedback while maintaining visual harmony.
        </p>

        <div class="guidelines-table-wrapper">
          <table class="guidelines-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="cell-property">Color</td>
                <td class="cell-value">
                  <span class="color-dot" style="background-color: rgba(15, 108, 189, 0.5);"></span>
                  <code>rgba(15, 108, 189, 0.5)</code>
                </td>
                <td>50% opacity primary blue</td>
              </tr>
              <tr>
                <td class="cell-property">Width</td>
                <td class="cell-value"><code>2px</code></td>
                <td>Ring thickness</td>
              </tr>
              <tr>
                <td class="cell-property">Offset</td>
                <td class="cell-value"><code>2px</code></td>
                <td>Gap between element and ring</td>
              </tr>
              <tr>
                <td class="cell-property">Box-shadow</td>
                <td class="cell-value"><code>none</code></td>
                <td>Removes Kendo's default black shadow</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="guidelines-section__subtitle">CSS Implementation</h3>
        <pre class="guidelines-code"><code>.k-button:focus,
.k-button.k-focus &#123;
  outline: 2px solid rgba(15, 108, 189, 0.5);
  outline-offset: 2px;
  box-shadow: none;  // Required to remove Kendo's black shadow
&#125;</code></pre>

        <h3 class="guidelines-section__subtitle">Affected Components</h3>
        <div class="guidelines-table-wrapper">
          <table class="guidelines-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Selector</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="cell-property">Buttons</td>
                <td class="cell-value"><code>.k-button</code></td>
                <td>All button variants</td>
              </tr>
              <tr>
                <td class="cell-property">Chips</td>
                <td class="cell-value"><code>.k-chip</code></td>
                <td>Filter pills and selection chips</td>
              </tr>
              <tr>
                <td class="cell-property">Inputs</td>
                <td class="cell-value"><code>.k-input</code></td>
                <td>Uses border color change instead</td>
              </tr>
              <tr>
                <td class="cell-property">Dropdowns</td>
                <td class="cell-value"><code>.k-dropdown</code></td>
                <td>Uses border color change instead</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Dark Background Section -->
      <section class="guidelines-section">
        <h2 class="guidelines-section__title">
          <i class="fa-solid fa-circle-half-stroke"></i> Dark Background Exception
        </h2>
        <p class="guidelines-section__desc">
          For buttons on dark or colored backgrounds (like the side navigation rail), use a white focus ring
          instead of blue for visibility.
        </p>

        <div class="guidelines-table-wrapper">
          <table class="guidelines-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="cell-property">Color</td>
                <td class="cell-value">
                  <span class="color-dot color-dot--white"></span>
                  <code>rgba(255, 255, 255, 0.5)</code>
                </td>
                <td>50% opacity white</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 class="guidelines-section__subtitle">CSS Implementation</h3>
        <pre class="guidelines-code"><code>.dark-background .k-button:focus &#123;
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
  box-shadow: none;
&#125;</code></pre>
      </section>

      <!-- Accessibility Section -->
      <section class="guidelines-section">
        <h2 class="guidelines-section__title">
          <i class="fa-solid fa-universal-access"></i> Accessibility Requirements
        </h2>
        <p class="guidelines-section__desc">
          Focus indicators are essential for keyboard navigation and WCAG 2.1 compliance (Success Criterion 2.4.7).
        </p>

        <div class="info-box info-box--do">
          <h3><i class="fa-solid fa-check"></i> Do</h3>
          <ul>
            <li>Always provide a visible focus indicator on interactive elements</li>
            <li>Ensure focus ring has sufficient contrast against the background</li>
            <li>Use <code>box-shadow: none</code> when overriding Kendo focus styles</li>
            <li>Test keyboard navigation for all interactive components</li>
            <li>Use white focus ring on dark/colored backgrounds</li>
          </ul>
        </div>

        <div class="info-box info-box--dont">
          <h3><i class="fa-solid fa-xmark"></i> Don't</h3>
          <ul>
            <li>Never use <code>outline: none</code> without providing an alternative focus indicator</li>
            <li>Don't remove focus styles for aesthetic reasons</li>
            <li>Don't rely solely on color change for focus indication</li>
            <li>Don't forget to test with keyboard-only navigation</li>
          </ul>
        </div>
      </section>

      <!-- Configuration Section -->
      <section class="guidelines-section">
        <h2 class="guidelines-section__title">
          <i class="fa-solid fa-gear"></i> Configuration
        </h2>
        <p class="guidelines-section__desc">
          Focus ring styles are configured globally in <code>_kendo-fluent-overrides.scss</code> using CSS custom properties.
        </p>

        <pre class="guidelines-code"><code>:root &#123;
  --kendo-focus-ring-color: rgba(15, 108, 189, 0.5);
  --kendo-focus-ring-width: 2px;
  --kendo-focus-ring-offset: 2px;
&#125;</code></pre>

        <p class="guidelines-section__note">
          <i class="fa-solid fa-circle-info"></i>
          These values are applied automatically to all Kendo buttons and chips. Component-specific overrides
          should only be used for special cases like dark backgrounds.
        </p>
      </section>
    </div>
  `,
  styles: [`
    .general-guidelines {
      display: flex;
      flex-direction: column;
      gap: var(--vdc-space-lg);
    }

    .general-guidelines__back {
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

    .general-guidelines__header {
      h1 { margin: 0 0 var(--vdc-space-xs); }
      p { margin: 0; }
    }

    .guidelines-section {
      background: var(--vdc-surface-100);
      border-radius: var(--vdc-radius-lg);
      padding: var(--vdc-space-lg);
      box-shadow: var(--vdc-shadow-sm);
    }

    .guidelines-section__title {
      margin: 0 0 var(--vdc-space-xs);
      font-size: var(--vdc-font-size-lg);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
      display: flex;
      align-items: center;
      gap: var(--vdc-space-sm);

      i { color: var(--vdc-primary); }
    }

    .guidelines-section__subtitle {
      margin: var(--vdc-space-lg) 0 var(--vdc-space-sm);
      font-size: var(--vdc-font-size-md);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
    }

    .guidelines-section__desc {
      margin: 0 0 var(--vdc-space-md);
      color: var(--vdc-text-secondary);
      font-size: var(--vdc-font-size-sm);
      line-height: var(--vdc-line-height-relaxed);
    }

    .guidelines-section__note {
      margin: var(--vdc-space-md) 0 0;
      padding: var(--vdc-space-sm) var(--vdc-space-md);
      background: var(--vdc-surface-200);
      border-radius: var(--vdc-radius-md);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);

      i { 
        color: var(--vdc-primary); 
        margin-right: var(--vdc-space-xs);
      }

      code {
        background: var(--vdc-surface-300);
        padding: 1px 4px;
        border-radius: var(--vdc-radius-sm);
        font-size: var(--vdc-font-size-xs);
      }
    }

    .guidelines-table-wrapper {
      overflow-x: auto;
    }

    .guidelines-table {
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

      .cell-property {
        font-weight: var(--vdc-font-weight-medium);
        color: var(--vdc-text-primary);
        white-space: nowrap;
      }

      .cell-value {
        display: flex;
        align-items: center;
        gap: var(--vdc-space-xs);
      }

      .cell-value code {
        background: var(--vdc-surface-300);
        padding: 2px 6px;
        border-radius: var(--vdc-radius-sm);
        font-family: monospace;
        font-size: var(--vdc-font-size-xs);
        color: var(--vdc-primary);
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

    .color-dot--white {
      background-color: rgba(255, 255, 255, 0.5);
      border: 1px solid var(--vdc-border-default);
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .guidelines-code {
      background: var(--vdc-surface-200);
      padding: var(--vdc-space-md);
      border-radius: var(--vdc-radius-md);
      overflow-x: auto;
      margin: 0;

      code {
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: var(--vdc-font-size-sm);
        color: var(--vdc-text-primary);
        white-space: pre;
      }
    }

    .info-box {
      margin-top: var(--vdc-space-md);
      padding: var(--vdc-space-md);
      border-radius: var(--vdc-radius-md);

      h3 {
        margin: 0 0 var(--vdc-space-sm);
        font-size: var(--vdc-font-size-md);
        font-weight: var(--vdc-font-weight-semibold);
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
      }
    }

    .info-box--do {
      background: color-mix(in srgb, var(--vdc-success) 10%, transparent);
      border-left: 4px solid var(--vdc-success);

      h3 { color: var(--vdc-success); }
      code { color: var(--vdc-success); }
    }

    .info-box--dont {
      background: color-mix(in srgb, var(--vdc-error) 10%, transparent);
      border-left: 4px solid var(--vdc-error);

      h3 { color: var(--vdc-error); }
      code { color: var(--vdc-error); }
    }
  `]
})
export class GeneralGuidelinesComponent {}
