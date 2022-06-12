import { Artist } from './../model/artist';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private readonly API = 'mycollection/api/artists'

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Artist[]>(this.API)
      .pipe(
        first(),
        map(result => result['data'])
      )
  }
}
