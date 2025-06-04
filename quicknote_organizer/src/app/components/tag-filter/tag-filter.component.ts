import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-tag-filter',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip-set multiple selectable>
      @for (tag of availableTags; track tag) {
        <mat-chip
          [selected]="selectedTags.includes(tag)"
          (click)="toggleTag(tag)">
          {{ tag }}
        </mat-chip>
      }
    </mat-chip-set>
  `,
  styles: [`
    mat-chip-set {
      margin: 16px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `]
})
export class TagFilterComponent {
  @Input() availableTags: string[] = [];
  @Output() filterChange = new EventEmitter<string[]>();

  selectedTags: string[] = [];

  toggleTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.filterChange.emit(this.selectedTags);
  }
}
