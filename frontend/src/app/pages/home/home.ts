import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../services/api.service';
import { IWordDetails } from '../../interfaces/word-details';
import { WordDetails } from '../../components/word-details/word-details';
import { StateService } from '../../services/state.service';
import { ProgressTracker } from '../../components/progress-tracker/progress-tracker';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, WordDetails, ProgressTracker],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  currentWord: string | null = '';
  wordDetails: IWordDetails | null = null;
  feedbackMessage = '';
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.showNextWord();
  }

  showNextWord(): void {
    this.wordDetails = null;
    this.feedbackMessage = '';
    this.apiService.getNextWord().subscribe(res => {
      this.currentWord = res.word;
      if (!this.currentWord) {
        this.feedbackMessage = "Parabéns! Você viu todas as palavras.";
      }
    });
  }

  handleKnownWord(): void {
    if (!this.currentWord) return;
    this.apiService.addKnownWord(this.currentWord).subscribe(() => {
      this.feedbackMessage = `Ótimo! "${this.currentWord}" marcada como conhecida.`;
      this.stateService.refreshStats(); // <-- Atualiza as estatísticas!
      setTimeout(() => this.showNextWord(), 2000);
    });
  }

  handleUnknownWord(): void {
    if (!this.currentWord) return;
    this.isLoading = true;
    // Primeiro, marca como desconhecida
    this.apiService.addUnknownWord(this.currentWord).subscribe(() => {
      this.stateService.refreshStats(); // <-- Atualiza as estatísticas!
      // Depois, busca os detalhes
      this.apiService.getWordDetails(this.currentWord!).subscribe({
        next: (details) => {
          this.wordDetails = details;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.feedbackMessage = 'Desculpe, não foi possível buscar os detalhes da palavra.';
          this.isLoading = false;
        }
      });
    });
  }
}
