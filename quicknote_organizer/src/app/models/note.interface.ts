/**
 * Interface representing a note in the QuickNote Organizer
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for note creation/update operations
 */
export interface NoteInput {
  title: string;
  content: string;
  tags: string[];
}

/**
 * Interface for note filtering options
 */
export interface NoteFilters {
  searchTerm?: string;
  tags?: string[];
}
