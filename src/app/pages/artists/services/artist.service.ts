import { Artist } from './../model/artist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private readonly API = 'mycollection/api/artists'

  private _refreshNeeded$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }


  list() {
    return this.httpClient.get<Artist[]>(this.API)
      .pipe(
        first(),
        map(result => result['data'])
      )
  }

  save(artist: Artist) {
    return this.httpClient.post<Artist>(this.API, artist)
      .pipe(
        first(),
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
  }

  delete(id: number) {
    return this.httpClient.delete<any>(`${this.API}/${id}`)
      .pipe(
        tap(() => {
          this._refreshNeeded$.next();
        }),
        map(response => response),
      );
  }
}
