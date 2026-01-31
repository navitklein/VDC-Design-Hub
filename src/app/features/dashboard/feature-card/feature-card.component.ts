import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Feature } from '../../../core/models';

/**
 * Feature Card Component - Displays a mockup feature in the gallery
 */
@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="['/mockups', feature.slug]" class="feature-card vdc-card">
      <!-- Thumbnail -->
      <div class="feature-card__thumbnail">
        <img 
          [src]="feature.thumbnail" 
          [alt]="feature.name"
          (error)="onImageError($event)">
        <div class="feature-card__overlay">
          <i class="fa-solid fa-eye"></i>
          View Mockup
        </div>
      </div>

      <!-- Content -->
      <div class="feature-card__content">
        <div class="feature-card__header">
          <h3 class="feature-card__title">{{ feature.name }}</h3>
          <span class="vdc-badge" [ngClass]="'vdc-badge--' + feature.status">
            {{ getStatusLabel(feature.status) }}
          </span>
        </div>

        <p class="feature-card__description">{{ feature.description }}</p>

        <div class="feature-card__footer">
          <div class="feature-card__tags">
            @for (tag of feature.tags.slice(0, 3); track tag) {
              <span class="feature-card__tag">{{ tag }}</span>
            }
          </div>
          <span class="feature-card__date">
            <i class="fa-solid fa-clock"></i>
            {{ formatDate(feature.lastUpdated) }}
          </span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .feature-card {
      display: block;
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-4px);

        .feature-card__overlay {
          opacity: 1;
        }
      }
    }

    .feature-card__thumbnail {
      position: relative;
      height: 180px;
      background-color: var(--vdc-surface-300);
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .feature-card__overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--vdc-space-sm);
      background-color: rgba(0, 120, 212, 0.85);
      color: white;
      font-weight: var(--vdc-font-weight-semibold);
      opacity: 0;
      transition: opacity 0.2s ease;

      i {
        font-size: 24px;
      }
    }

    .feature-card__content {
      padding: var(--vdc-space-md);
    }

    .feature-card__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--vdc-space-sm);
      margin-bottom: var(--vdc-space-sm);
    }

    .feature-card__title {
      margin: 0;
      font-size: var(--vdc-font-size-lg);
      font-weight: var(--vdc-font-weight-semibold);
      color: var(--vdc-text-primary);
    }

    .feature-card__description {
      margin: 0 0 var(--vdc-space-md);
      font-size: var(--vdc-font-size-sm);
      color: var(--vdc-text-secondary);
      line-height: var(--vdc-line-height-normal);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .feature-card__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--vdc-space-sm);
    }

    .feature-card__tags {
      display: flex;
      gap: var(--vdc-space-xs);
      flex-wrap: wrap;
    }

    .feature-card__tag {
      padding: 2px 8px;
      background-color: var(--vdc-surface-300);
      border-radius: var(--vdc-radius-full);
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-secondary);
    }

    .feature-card__date {
      display: flex;
      align-items: center;
      gap: var(--vdc-space-xs);
      font-size: var(--vdc-font-size-xs);
      color: var(--vdc-text-disabled);
      white-space: nowrap;

      i {
        font-size: 12px;
      }
    }
  `]
})
export class FeatureCardComponent {
  @Input({ required: true }) feature!: Feature;
  
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      draft: 'Draft',
      review: 'In Review',
      ready: 'Ready'
    };
    return labels[status] || status;
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Set a placeholder gradient
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.style.background = 'linear-gradient(135deg, var(--vdc-primary) 0%, var(--vdc-secondary) 100%)';
      parent.innerHTML = '<i class="fa-solid fa-image" style="font-size: 48px; color: rgba(255,255,255,0.5);"></i>';
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';
      parent.style.justifyContent = 'center';
    }
  }
}
