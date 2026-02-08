// frontend/src/app/components/nav-stats/nav-stats.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { IStats } from '../../interfaces/stats';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-nav-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-stats.html',
})
export class NavStats {
  // A pipe 'async' no template vai lidar com a inscrição/desinscrição automaticamente.
  public stats$: Observable<IStats | null>;

  constructor(private stateService: StateService) {
    this.stats$ = this.stateService.stats$;
  }
}
