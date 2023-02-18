import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((mod) => mod.HomeModule)
  },
  {
    path: 'sheet',
    loadChildren: () =>
      import('./pages/sheet-list/sheet-list.module').then((mod) => mod.SheetListModule)
  },
  {
    path: 'sheetInfo/:id',
    loadChildren: () =>
      import('./pages/sheet-info/sheet-info.module').then((mod) => mod.SheetInfoModule)
  },
  {
    path: 'singer/:id',
    loadChildren: () => import('./pages/singer/singer.module').then((mod) => mod.SingerModule)
  },
  {
    path: 'songInfo/:id',
    loadChildren: () =>
      import('./pages/song-info/song-info.module').then((mod) => mod.SongInfoModule)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //滚动条置顶
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
