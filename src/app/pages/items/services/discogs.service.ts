import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DiscogsSearchResponse, DiscogsRelease, DiscogsMasterRelease } from '../model/discogs';

@Injectable({
  providedIn: 'root'
})
export class DiscogsService {

  private readonly API = 'mycollection/api/discogs';

  constructor(private httpClient: HttpClient) {}

  /**
   * Busca geral no Discogs
   */
  search(query: string, type: string = 'release', page: number = 1, perPage: number = 20): Observable<DiscogsSearchResponse> {
    return this.httpClient.get<any>(`${this.API}/search`, {
      params: {
        query,
        type,
        page: page.toString(),
        perPage: perPage.toString()
      }
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Busca releases por nome do artista
   */
  searchByArtist(name: string, page: number = 1, perPage: number = 20): Observable<DiscogsSearchResponse> {
    return this.httpClient.get<any>(`${this.API}/search/artist`, {
      params: {
        name,
        page: page.toString(),
        perPage: perPage.toString()
      }
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Busca releases por título do álbum
   */
  searchByAlbum(title: string, page: number = 1, perPage: number = 20): Observable<DiscogsSearchResponse> {
    return this.httpClient.get<any>(`${this.API}/search/album`, {
      params: {
        title,
        page: page.toString(),
        perPage: perPage.toString()
      }
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtém detalhes completos de um release
   */
  getReleaseDetails(releaseId: number): Observable<DiscogsRelease> {
    return this.httpClient.get<any>(`${this.API}/releases/${releaseId}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtém detalhes de um artista
   */
  getArtistDetails(artistId: number): Observable<DiscogsArtistDetails> {
    return this.httpClient.get<any>(`${this.API}/artists/${artistId}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtém detalhes de um master release (álbum original com ano original)
   */
  getMasterDetails(masterId: number): Observable<DiscogsMasterRelease> {
    return this.httpClient.get<any>(`${this.API}/masters/${masterId}`).pipe(
      map(response => response.data)
    );
  }

}

export interface DiscogsArtistDetails {
  id: number;
  name: string;
  realName?: string;
  profile?: string;
  dataQuality?: string;
  nameVariations?: string[];
  images?: { type: string; uri: string; uri150: string; }[];
  resourceUrl?: string;
  uri?: string;
  releasesUrl?: string;
}
