import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorPage } from './author.page';

const routes: Routes = [
  {
    path: '',
    component: AuthorPage
  },
  {
    path: 'songs',
    loadChildren: () => import('./songs/songs.module').then( m => m.SongsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorPageRoutingModule {}
