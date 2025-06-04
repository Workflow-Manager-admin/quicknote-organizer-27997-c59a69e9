import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { NoteCardComponent } from './components/note-card/note-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { TagFilterComponent } from './components/tag-filter/tag-filter.component';
import { NoteService } from './services/note.service';
import { Note, NoteInput } from './models/note.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    NoteCardComponent,
    SearchBarComponent,
    TagFilterComponent
  ],
  template: `
    <div class="container">
      <app-search-bar (search)="onSearch($event)" />
      
      <app-tag-filter
        [availableTags]="tags()"
        (filterChange)="onTagFilter($event)" />

      <div class="notes-grid">
        @for (note of notes(); track note.id) {
          <app-note-card
            [note]="note"
            (onEdit)="editNote($event)"
            (onDelete)="deleteNote($event)" />
        }
        @empty {
          <div class="no-notes">
            <mat-icon>note</mat-icon>
            <p>No notes found</p>
          </div>
        }
      </div>

      <button 
        mat-fab 
        color="primary" 
        class="fab-button"
        (click)="createNote()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .container {
      padding: 16px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px 0;
    }

    .no-notes {
      grid-column: 1 / -1;
      text-align: center;
      padding: 32px;
      color: #666;
    }

    .no-notes mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .fab-button {
      position: fixed;
      bottom: 32px;
      right: 32px;
    }

    @media (max-width: 600px) {
      .notes-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {
  private noteService = inject(NoteService);
  private dialog = inject(MatDialog);

  notes = this.noteService.getNotes();
  tags = this.noteService.getAllTags();

  onSearch(term: string) {
    this.noteService.updateFilters({ searchTerm: term });
  }

  onTagFilter(tags: string[]) {
    this.noteService.updateFilters({ tags });
  }

  createNote() {
    // TODO: Implement note creation dialog
    const noteInput: NoteInput = {
      title: 'New Note',
      content: '',
      tags: []
    };
    this.noteService.createNote(noteInput);
  }

  editNote(note: Note) {
    // TODO: Implement note editing dialog
    console.log('Edit note:', note);
  }

  deleteNote(id: string) {
    this.noteService.deleteNote(id);
  }
}
