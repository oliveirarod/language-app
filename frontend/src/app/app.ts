import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from './services/api.service';
import { RouterOutlet } from '@angular/router';
import { NavStats } from './components/nav-stats/nav-stats';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavStats],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  constructor() {}

  protected readonly title = signal('frontend');
}
