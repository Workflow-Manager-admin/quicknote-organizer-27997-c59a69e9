import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Note, NoteInput, NoteFilters } from '../models/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private notes = new BehaviorSubject<Note[]>([]);
  private filters = new BehaviorSubject<NoteFilters>({});

  // PUBLIC_INTERFACE
  /**
   * Get all notes with applied filters
   */
  getNotes(): Observable<Note[]> {
    return this.notes.pipe(
      map(notes => this.applyFilters(notes, this.filters.value))
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Get all unique tags from notes
   */
  getAllTags(): Observable<string[]> {
    return this.notes.pipe(
      map(notes => [...new Set(notes.flatMap(note => note.tags))])
    );
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new note
   */
  createNote(noteInput: NoteInput): void {
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteInput,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.notes.next([...this.notes.value, newNote]);
  }

  // PUBLIC_INTERFACE
  /**
   * Update an existing note
   */
  updateNote(id: string, noteInput: NoteInput): void {
    const updatedNotes = this.notes.value.map(note =>
      note.id === id
        ? { ...note, ...noteInput, updatedAt: new Date() }
        : note
    );
    this.notes.next(updatedNotes);
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note by ID
   */
  deleteNote(id: string): void {
    const filteredNotes = this.notes.value.filter(note => note.id !== id);
    this.notes.next(filteredNotes);
  }

  // PUBLIC_INTERFACE
  /**
   * Update filters for notes
   */
  updateFilters(filters: NoteFilters): void {
    this.filters.next(filters);
  }

  private applyFilters(notes: Note[], filters: NoteFilters): Note[] {
    let filteredNotes = [...notes];

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filteredNotes = filteredNotes.filter(note =>
        filters.tags!.some(tag => note.tags.includes(tag))
      );
    }

    return filteredNotes;
  }
}
