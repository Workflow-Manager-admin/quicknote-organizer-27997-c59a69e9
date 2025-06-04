import { Component, Input, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Note } from '../../models/note.interface';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  animations: [
    trigger('cardAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', [
        animate('200ms ease-out')
      ]),
      transition('* => void', [
        animate('150ms ease-in')
      ])
    ]),
    trigger('actionMode', [
      state('true', style({
        opacity: 1,
        height: '*'
      })),
      state('false', style({
        opacity: 0,
        height: '0'
      })),
      transition('true <=> false', [
        animate('200ms ease-in-out')
      ])
    ])
  ],
  template: `
    <mat-card 
      class="note-card"
      [@cardAnimation]
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
        <mat-chip-listbox>
          @for (tag of note.tags; track tag) {
            <mat-chip-option>{{ tag }}</mat-chip-option>
          }
        </mat-chip-listbox>
      </mat-card-content>
      @if (isActionMode) {
        <mat-card-actions [@actionMode]="isActionMode">
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
