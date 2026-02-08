import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../../services/api.service';
import { StatsCard } from '../../components/stats-card/stats-card';
import { WordList } from '../../components/word-list/word-list';
import { IStats } from '../../interfaces/stats';

@Component({
  selector: 'app-my-words',
  standalone: true,
  imports: [CommonModule, StatsCard, WordList],
  templateUrl: './my-words.html',
  styleUrls: ['./my-words.scss']
})
export class MyWords implements OnInit {
  stats: IStats = { known: 0, unknown: 0, total: 0 };
  knownWords: string[] = [];
  unknownWords: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUserStats().subscribe(stats => {
      this.stats = stats;
    });

    this.apiService.getUserProgress().subscribe(progress => {
      this.knownWords = progress.knownWords;
      this.unknownWords = progress.unknownWords;
    });
  }
}
