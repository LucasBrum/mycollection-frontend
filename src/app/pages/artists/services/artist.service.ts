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
  private _jsonCountries = 'assets/countries.json'
  private _refreshNeeded$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {
    this.listCountries().subscribe(data => {
      console.log(data);
    })
  }

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

  getArtistById(id: number) {
    return this.httpClient.get<Artist[]>(`${this.API}/${id}`)
      .pipe(
        first(),
        map(result => result['data'])
      )
  }

  getCoverFromAlbum(id: number) {
    return this.httpClient.get(`${this.API}/album/cover/${id}`, { responseType: 'text' })
      // .pipe(
      //   first(),
      //   map(result => result['data'])
      // )
  }

  listCountries() {
    return this.httpClient.get(this._jsonCountries)
    .pipe(
      first(),
      map(result => result[''])
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

  update(id: number, artist: Artist) {
    return this.httpClient.put(`${this.API}/${id}`, artist)
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
