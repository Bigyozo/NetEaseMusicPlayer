import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Song } from 'src/app/services/data.types/common.types';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { Lyric } from '../../services/data.types/common.types';
import { SongService } from '../../services/song.service';

type SongDataModel = [Song, Lyric];

@Injectable({ providedIn: 'root' })
export class SongInfoResolverService implements Resolve<SongDataModel> {
  constructor(private songService: SongService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> {
    const id = route.paramMap.get('id');
    return forkJoin([
      this.songService.getSongDetail(id),
      this.songService.getLyric(Number(id))
    ]).pipe(
      first(),
      catchError(() => {
        this.router.navigate(['/home']);
        return EMPTY;
      })
    );
  }
}
