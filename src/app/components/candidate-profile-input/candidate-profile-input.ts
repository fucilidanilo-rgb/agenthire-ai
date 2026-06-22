import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

export interface CandidateProfile {
  source: 'pdf' | 'linkedin' | 'manual' | null;
  text: string;
  fileName?: string;
  linkedinUrl?: string;
  isReady: boolean;
}

@Component({
  selector: 'app-candidate-profile-input',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './candidate-profile-input.html',
  styleUrl: './candidate-profile-input.scss',
})
export class CandidateProfileInputComponent {
  @Output() profileChange = new EventEmitter<CandidateProfile>();
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  manualText = '';
  linkedinUrl = '';
  pdfFileName = '';
  pdfMockText = '';
  pdfError = '';
  isDragOver = false;

  get activeSource(): 'pdf' | 'linkedin' | 'manual' | null {
    if (this.manualText.trim()) return 'manual';
    if (this.pdfFileName) return 'pdf';
    if (this.linkedinUrl.trim()) return 'linkedin';
    return null;
  }

  get resolvedText(): string {
    if (this.manualText.trim()) return this.manualText;
    if (this.pdfFileName) return this.pdfMockText;
    if (this.linkedinUrl.trim()) return this.buildLinkedinMock();
    return '';
  }

  get isReady(): boolean {
    return this.activeSource !== null;
  }

  get sourceLabel(): string {
    switch (this.activeSource) {
      case 'pdf':     return 'CV PDF';
      case 'linkedin': return 'LinkedIn';
      case 'manual':  return 'Testo manuale';
      default:        return '—';
    }
  }

  private buildLinkedinMock(): string {
    return `[Profilo LinkedIn] ${this.linkedinUrl}\n\nSoftware Engineer con esperienza in sviluppo frontend e backend. Competenze in React, TypeScript, Angular, Node.js, Docker. Appassionato di prodotto e metodologie agili.`;
  }

  private buildPdfMock(fileName: string): string {
    return `[CV PDF: ${fileName}]\n\nCV caricato correttamente. Il contenuto verrà analizzato dagli agenti.\n\nSoftware Engineer · 5 anni di esperienza · React, TypeScript, Angular, Node.js, Docker, Git, Agile/Scrum · Laurea in Informatica.`;
  }

  private emit(): void {
    this.profileChange.emit({
      source: this.activeSource,
      text: this.resolvedText,
      fileName: this.pdfFileName || undefined,
      linkedinUrl: this.linkedinUrl.trim() || undefined,
      isReady: this.isReady,
    });
  }

  onManualChange(): void {
    this.emit();
  }

  onLinkedinChange(): void {
    this.emit();
  }

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  onDropzoneClick(): void {
    if (!this.pdfFileName) this.triggerFileInput();
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    // only fire if leaving the dropzone itself, not a child
    const target = event.relatedTarget as Node | null;
    const zone = (event.currentTarget as HTMLElement);
    if (!zone.contains(target)) {
      this.isDragOver = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File): void {
    this.pdfError = '';
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      this.pdfError = 'Formato non supportato. Carica un file .pdf.';
      this.pdfFileName = '';
      this.pdfMockText = '';
      this.emit();
      return;
    }
    this.pdfFileName = file.name;
    this.pdfMockText = this.buildPdfMock(file.name);
    this.emit();
  }

  removePdf(): void {
    this.pdfFileName = '';
    this.pdfMockText = '';
    this.pdfError = '';
    this.emit();
  }
}
