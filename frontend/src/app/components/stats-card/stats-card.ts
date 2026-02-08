import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
})
export class StatsCard {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() cardClass: string = 'bg-secondary'; // Cor padrão
}
