import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'song',
    pathMatch: 'full'
  },
  {
    path: 'song',
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/song/song.module').then( m => m.SongPageModule),
      },
      {
        path: "detail/:id",
        loadChildren: () => import('./pages/song/detail/detail.module').then( m => m.DetailPageModule),
      }
    ]
  },
  {
    path: 'author',
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/author/author.module').then( m => m.AuthorPageModule)
      },
      {
        path: "song/:authorId",
        loadChildren: () => import('./pages/author/songs/songs.module').then( m => m.SongsPageModule),
      }
    ]
  },
  {
    path: 'album',
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/album/album.module').then( m => m.AlbumPageModule)
      },
      {
        path: "song/:albumId",
        loadChildren: () => import('./pages/album/songs/songs.module').then( m => m.SongsPageModule),
      }
    ]
  },
  {
    path: 'popular',
    loadChildren: () => import('./pages/popular/popular.module').then( m => m.PopularPageModule)
  },
  {
    path: 'new',
    loadChildren: () => import('./pages/new/new.module').then( m => m.NewPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
