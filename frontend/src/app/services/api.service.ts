import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { IWordDetails } from '../interfaces/word-details';
import { IProgress } from '../interfaces/progress';
import { IStats } from '../interfaces/stats';

@Injectable({
  providedIn: 'root'
} )
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient ) { }

  // --- Rotas de Palavras ---
  getWordDetails(word: string): Observable<IWordDetails> {
    // Garante que a palavra enviada para a IA esteja em minúsculas
    return this.http.post<IWordDetails>(`${this.apiUrl}/words/info`, { word: word.toLowerCase( ) });
  }

  getNextWord(): Observable<{ word: string | null }> {
    return this.http.get<{ word:string | null }>(`${this.apiUrl}/words/next` );
  }

  // --- Rotas de Progresso do Usuário ---
  getUserProgress(): Observable<IProgress> {
    return this.http.get<IProgress>(`${this.apiUrl}/users/progress` );
  }

  addKnownWord(word: string): Observable<any> {
    // Garante que a palavra salva no progresso esteja em minúsculas
    return this.http.post(`${this.apiUrl}/users/known`, { word: word.toLowerCase( ) });
  }

  addUnknownWord(word: string): Observable<any> {
    // Garante que a palavra salva no progresso esteja em minúsculas
    return this.http.post(`${this.apiUrl}/users/unknown`, { word: word.toLowerCase( ) });
  }

  getUserStats(): Observable<IStats> {
    return this.http.get<IStats>(`${this.apiUrl}/users/stats` );
  }
}
