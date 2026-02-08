import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { MyWords } from './pages/my-words/my-words';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'my-words', component: MyWords },
  { path: 'about', component: About },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona para home por padrão
  { path: '**', redirectTo: '/home' } // Rota coringa para qualquer outra URL
];
