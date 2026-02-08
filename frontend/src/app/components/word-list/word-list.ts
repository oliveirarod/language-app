import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-list.html',
})
export class WordList {
  @Input() title: string = '';
  @Input() words: string[] = [];
  @Input() iconClass: string = 'bi-list'; // Ícone padrão
}
