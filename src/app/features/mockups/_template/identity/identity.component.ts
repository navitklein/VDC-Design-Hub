import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownLoaderService } from '../../../../core/services/markdown-loader.service';

/**
 * Identity Component - Cover sheet for a mockup feature
 * Displays problem statement, research links, constraints from markdown
 */
@Component({
  selector: 'app-identity',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  template: `
    <div class="identity">
      @if (loading()) {
        <div class="identity__loading">
          <div class="vdc-skeleton" style="height: 40px; width: 60%; margin-bottom: 24px;"></div>
          <div class="vdc-skeleton" style="height: 20px; width: 100%; margin-bottom: 8px;"></div>
          <div class="vdc-skeleton" style="height: 20px; width: 90%; margin-bottom: 8px;"></div>
          <div class="vdc-skeleton" style="height: 20px; width: 80%; margin-bottom: 24px;"></div>
          <div class="vdc-skeleton" style="height: 200px;"></div>
        </div>
      }

      @if (!loading() && content()) {
        <div class="identity__content">
          <markdown [data]="content()"></markdown>
        </div>
      }

      @if (!loading() && !content()) {
        <div class="vdc-empty-state">
          <i class="fa-solid fa-file-alt vdc-empty-state__icon"></i>
          <h3 class="vdc-empty-state__title">No Identity Document</h3>
          <p class="vdc-empty-state__description">
            Create an identity.md file in the content folder for this mockup
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    .identity {
      max-width: 800px;
    }

    .identity__content {
      line-height: var(--vdc-line-height-relaxed);

      ::ng-deep {
        h1 {
          font-size: var(--vdc-font-size-2xl);
          font-weight: var(--vdc-font-weight-bold);
          margin: 0 0 var(--vdc-space-lg);
          color: var(--vdc-text-primary);
        }

        h2 {
          font-size: var(--vdc-font-size-lg);
          font-weight: var(--vdc-font-weight-semibold);
          margin: var(--vdc-space-xl) 0 var(--vdc-space-md);
          color: var(--vdc-text-primary);
          border-bottom: 1px solid var(--vdc-border-subtle);
          padding-bottom: var(--vdc-space-sm);
        }

        p {
          margin: 0 0 var(--vdc-space-md);
          color: var(--vdc-text-secondary);
        }

        ul, ol {
          margin: 0 0 var(--vdc-space-md);
          padding-left: var(--vdc-space-lg);
          color: var(--vdc-text-secondary);
        }

        li {
          margin-bottom: var(--vdc-space-xs);
        }

        a {
          color: var(--vdc-primary);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }

        code {
          background-color: var(--vdc-surface-300);
          padding: 2px 6px;
          border-radius: var(--vdc-radius-sm);
          font-size: var(--vdc-font-size-sm);
        }

        blockquote {
          border-left: 4px solid var(--vdc-primary);
          margin: var(--vdc-space-md) 0;
          padding: var(--vdc-space-sm) var(--vdc-space-md);
          background-color: var(--vdc-surface-200);
          color: var(--vdc-text-secondary);
        }
      }
    }
  `]
})
export class IdentityComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly markdownLoader = inject(MarkdownLoaderService);
  
  readonly loading = signal(true);
  readonly content = signal<string>('');
  
  ngOnInit(): void {
    const slug = this.route.parent?.snapshot.paramMap.get('slug') || '';
    
    this.markdownLoader.loadIdentity(slug).subscribe({
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
