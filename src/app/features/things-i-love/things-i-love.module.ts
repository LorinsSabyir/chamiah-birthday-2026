import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MemoryAlbumsComponent } from '../memories/memory-albums.component';
import { ThingsILoveComponent } from './things-i-love.component';

@NgModule({
  declarations: [ThingsILoveComponent],
  imports: [
    MemoryAlbumsComponent,
    RouterModule.forChild([
      {
        path: '',
        component: ThingsILoveComponent,
        title: 'Things I Love About You',
        data: { deck: 'love', deckTitle: 'Things I love about you', deckSubtitle: 'A few of the many reasons you are so special to me.' },
      },
    ]),
  ],
})
export class ThingsILoveModule {}
