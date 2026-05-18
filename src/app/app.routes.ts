import { Routes } from '@angular/router';

import { HomeResolverService } from './pages/home/home-resolve.service';
import { SheetInfoResolverService } from './pages/sheet-info/sheet-info-resolver.service';
import { SingerResolverService } from './pages/singer/singer-detail/singer-resolver.service';
import { SongInfoResolverService } from './pages/song-info/song-info-resolver.service';
import { CenterResolverService } from './pages/member/center/center-resolve.service';
import { RecordResolverService } from './pages/member/record-detail/record-resolve.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    data: { title: '発見 - NetEase Music' },
    resolve: { homeDatas: HomeResolverService },
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
    resolve: { sheetInfo: SheetInfoResolverService },
    loadComponent: () => import('./pages/sheet-info/sheet-info.component').then(m => m.SheetInfoComponent)
  },
  {
    path: 'singer/:id',
    data: { title: '歌手 - NetEase Music' },
    resolve: { singerDetail: SingerResolverService },
    loadComponent: () => import('./pages/singer/singer-detail/singer-detail.component').then(m => m.SingerDetailComponent)
  },
  {
    path: 'songInfo/:id',
    data: { title: '曲詳細 - NetEase Music' },
    resolve: { songInfo: SongInfoResolverService },
    loadComponent: () => import('./pages/song-info/song-info.component').then(m => m.SongInfoComponent)
  },
  {
    path: 'member/:id',
    data: { title: '個人センター - NetEase Music' },
    resolve: { user: CenterResolverService },
    loadComponent: () => import('./pages/member/center/center.component').then(m => m.CenterComponent)
  },
  {
    path: 'records/:id',
    data: { title: '聴取履歴 - NetEase Music' },
    resolve: { user: RecordResolverService },
    loadComponent: () => import('./pages/member/record-detail/record-detail.component').then(m => m.RecordDetailComponent)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
