import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SongPage } from './song.page';

const routes: Routes = [
  {
    path: '',
    component: SongPage
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SongPageRoutingModule {}
