import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    data: { title: '発見 - NetEase Music' },
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'sheet',
    data: { title: '歌単 - NetEase Music' },
    loadComponent: () => import('./pages/sheet-list/sheet-list.component').then(m => m.SheetListComponent)
  },
  {
    path: 'sheetInfo/:id',
    data: { title: '歌単詳細 - NetEase Music' },
    loadComponent: () => import('./pages/sheet-info/sheet-info.component').then(m => m.SheetInfoComponent)
  },
  {
    path: 'singer/:id',
    data: { title: '歌手 - NetEase Music' },
    loadComponent: () => import('./pages/singer/singer-detail/singer-detail.component').then(m => m.SingerDetailComponent)
  },
  {
    path: 'songInfo/:id',
    data: { title: '曲詳細 - NetEase Music' },
    loadComponent: () => import('./pages/song-info/song-info.component').then(m => m.SongInfoComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
