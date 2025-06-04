import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tag-filter',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
  template: `
    <mat-chip-listbox multiple [selectable]="true">
      @for (tag of availableTags; track tag) {
        <mat-chip-option
          [selected]="selectedTags.includes(tag)"
          (selectionChange)="toggleTag(tag)">
          {{ tag }}
        </mat-chip-option>
      }
    </mat-chip-listbox>
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
