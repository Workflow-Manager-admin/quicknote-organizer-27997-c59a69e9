import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Note, NoteInput } from '../../models/note.interface';

interface DialogData {
  note?: Note;
  isEdit: boolean;
}

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Edit Note' : 'Create Note' }}</h2>
    <mat-dialog-content>
      <form #noteForm="ngForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Title</mat-label>
          <input
            matInput
            required
            [(ngModel)]="noteInput.title"
            name="title"
            placeholder="Note title">
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Content</mat-label>
          <textarea
            matInput
            [(ngModel)]="noteInput.content"
            name="content"
            placeholder="Note content"
            rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Tags (comma separated)</mat-label>
          <input
            matInput
            [(ngModel)]="tagInput"
            name="tags"
            placeholder="Enter tags"
            (keyup.enter)="addTag()">
        </mat-form-field>

        <mat-chip-listbox>
          @for (tag of noteInput.tags; track tag) {
            <mat-chip-option
              (removed)="removeTag(tag)">
              {{tag}}
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-option>
          }
        </mat-chip-listbox>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!noteForm.form.valid"
        (click)="onSave()">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-dialog-content {
      min-width: 400px;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: auto;
      }
    }

    mat-chip-listbox {
      margin-bottom: 16px;
    }
  `]
})
export class NoteDialogComponent {
  noteInput: NoteInput;
  tagInput = '';

  constructor(
    public dialogRef: MatDialogRef<NoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.noteInput = data.isEdit
      ? {
          title: data.note!.title,
          content: data.note!.content,
          tags: [...data.note!.tags]
        }
      : {
          title: '',
          content: '',
          tags: []
        };
  }

  addTag(): void {
    if (this.tagInput.trim()) {
      const newTags = this.tagInput.split(',').map(tag => tag.trim());
      this.noteInput.tags = [...new Set([...this.noteInput.tags, ...newTags])];
      this.tagInput = '';
    }
  }

  removeTag(tag: string): void {
    this.noteInput.tags = this.noteInput.tags.filter(t => t !== tag);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.noteInput);
  }
}
