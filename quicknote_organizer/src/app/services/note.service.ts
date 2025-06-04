import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Note, NoteInput, NoteFilters } from '../models/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private readonly STORAGE_KEY = 'quicknote_notes';
  private notes = new BehaviorSubject<Note[]>(this.loadNotesFromStorage());
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
    const updatedNotes = [...this.notes.value, newNote];
    this.notes.next(updatedNotes);
    this.saveNotesToStorage(updatedNotes);
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
    this.saveNotesToStorage(updatedNotes);
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a note by ID
   */
  deleteNote(id: string): void {
    const filteredNotes = this.notes.value.filter(note => note.id !== id);
    this.notes.next(filteredNotes);
    this.saveNotesToStorage(filteredNotes);
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

  private loadNotesFromStorage(): Note[] {
    const savedNotes = localStorage.getItem(this.STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        return parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
      } catch (error: any) {
        console.error('Error loading notes from storage:', error);
        return [];
      }
    }
    return [];
  }

  private saveNotesToStorage(notes: Note[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    } catch (error: any) {
      console.error('Error saving notes to storage:', error);
    }
  }
}
