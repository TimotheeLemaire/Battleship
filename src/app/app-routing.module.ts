import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game/game.component';
import { BrowseComponent } from './browse/browse.component';
import { SaveComponent } from './save/save.component';

const routes: Routes = [
  { path: 'browse', component: BrowseComponent },
  { path: 'game', component: GameComponent },
  { path: 'saved', component: SaveComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
