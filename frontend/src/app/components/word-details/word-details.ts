import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IWordDetails } from '../../interfaces/word-details'; // Renomeando para evitar conflito

@Component({
  selector: 'app-word-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-details.html',
})
export class WordDetails {
  @Input() details!: IWordDetails; 
}
