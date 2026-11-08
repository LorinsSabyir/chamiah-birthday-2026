import { Routes } from '@angular/router';
import { BirthdayIntroComponent } from './features/intro/birthday-intro.component';
import { LoveLetterComponent } from './features/letter/love-letter.component';
import { MemoryAlbumsComponent } from './features/memories/memory-albums.component';
import { BirthdayWishesComponent } from './features/wishes/birthday-wishes.component';

export const routes: Routes = [
  { path: '', component: BirthdayIntroComponent, title: 'A Birthday Surprise' },
  { path: 'memories', component: MemoryAlbumsComponent, title: 'Our Little Scrapbook', data: { deck: 'memories', deckTitle: 'Our memories', deckSubtitle: 'Little moments, held close to my heart.' } },
  { path: 'things-i-love', loadChildren: () => import('./features/things-i-love/things-i-love.module').then((module) => module.ThingsILoveModule) },
  { path: 'letter', component: LoveLetterComponent, title: 'A Note From My Heart' },
  { path: 'wishes', component: BirthdayWishesComponent, title: 'Birthday Wishes For You' },
  { path: '**', redirectTo: '' },
];
