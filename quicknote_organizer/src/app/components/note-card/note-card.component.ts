import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  template: `
    <mat-card 
      class="note-card"
      (longpress)="onLongPress()"
      (swipeleft)="onSwipeLeft()"
      (swiperight)="onSwipeRight()">
      <mat-card-header>
        <mat-card-title>{{ note.title }}</mat-card-title>
        <mat-card-subtitle>
          {{ note.updatedAt | date:'short' }}
        </mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p>{{ note.content }}</p>
        <mat-chip-set>
          @for (tag of note.tags; track tag) {
            <mat-chip>{{ tag }}</mat-chip>
          }
        </mat-chip-set>
      </mat-card-content>
      @if (isActionMode) {
        <mat-card-actions>
          <button mat-icon-button (click)="onEdit.emit(note)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="onDelete.emit(note.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </mat-card-actions>
      }
    </mat-card>
  `,
  styles: [`
    .note-card {
      margin: 8px;
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }

    .note-card:hover {
      transform: translateY(-2px);
    }

    mat-card-content {
      margin-top: 16px;
    }

    p {
      margin-bottom: 16px;
      white-space: pre-wrap;
    }

    mat-chip-set {
      margin-top: 8px;
    }
  `]
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() onEdit = new EventEmitter<Note>();
  @Output() onDelete = new EventEmitter<string>();

  isActionMode = false;

  onLongPress() {
    this.isActionMode = !this.isActionMode;
  }

  onSwipeLeft() {
    this.onDelete.emit(this.note.id);
  }

  onSwipeRight() {
    this.onEdit.emit(this.note);
  }
}
