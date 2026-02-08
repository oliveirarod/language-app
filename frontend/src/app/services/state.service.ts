import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStats } from '../interfaces/stats';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Começamos com 'null' para que possamos saber explicitamente quando os dados ainda não chegaram.
  private statsSubject = new BehaviorSubject<IStats | null>(null);
  public stats$: Observable<IStats | null> = this.statsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  /**
   * O ponto de entrada para carregar os dados.
   * Será chamado pelo componente principal do app.
   */
  public loadInitialStats(): void {
    // Só busca se os dados ainda não foram carregados.
    if (this.statsSubject.value === null) {
      this.refreshStats();
    }
  }

  /**
   * Busca os dados mais recentes do backend e atualiza o BehaviorSubject.
   */
  public refreshStats(): void {
    this.apiService.getUserStats().subscribe(stats => {
      this.statsSubject.next(stats);
    });
  }
}
