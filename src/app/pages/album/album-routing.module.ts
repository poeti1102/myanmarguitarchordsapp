import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbumPage } from './album.page';

const routes: Routes = [
  {
    path: '',
    component: AlbumPage
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
export class AlbumPageRoutingModule {}
