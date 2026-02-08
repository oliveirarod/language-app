import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IStats } from '../../interfaces/stats';
import { StateService } from '../../services/state.service';
import { IProgressViewModel } from '../../interfaces/progress-view-model'; // Importe a nova interface

@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-tracker.html',
  styleUrls: ['./progress-tracker.scss']
})
export class ProgressTracker {
  // Teremos um único Observable para o template
  public viewModel$: Observable<IProgressViewModel>;

  constructor(private stateService: StateService) {
    this.viewModel$ = this.stateService.stats$.pipe(
      // 1. Filtra as emissões iniciais de 'null'
      filter((stats): stats is IStats => stats !== null),

      // 2. Transforma o objeto 'IStats' em um 'IProgressViewModel'
      map(stats => {
        const percentage = (stats.total > 0)
          ? Math.round((stats.known / stats.total) * 100)
          : 0;
        
        // Retorna um único objeto com tudo que o template precisa
        return { stats, percentage };
      })
    );
  }
}
