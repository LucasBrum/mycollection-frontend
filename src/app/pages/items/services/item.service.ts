import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { Item } from '../model/item';


export interface ItemWithCoverImage {
  id: number;
  title: string;
  releaseYear: number;
  genre: string;
  coverImagePath: string;
  artist: {
    id: number;
    name: string;
    country: string;
  };
  category: {
    id: number;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly API = 'mycollection/api/items';

  private _refreshNeeded$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }


  save(item: Item) {
    console.log("Item to save:", item);
    const body = this.sanitize(item);
    console.log("Sanitized body:", body);

    const formData = new FormData();
    
    // Separa a imagem do resto dos dados
    const { coverImageFile, ...itemData } = body;
    
    // Adiciona o item como um Blob JSON
    const itemBlob = new Blob([JSON.stringify(itemData)], {
      type: 'application/json'
    });
    formData.append('item', itemBlob);
    
    // Adiciona a imagem se existir
    if (coverImageFile) {
      formData.append('coverImageFile', coverImageFile, coverImageFile.name);
    }

    // Configura os headers para multipart/form-data
    const headers = {
      Accept: 'application/json',
    };

    return this.httpClient.post<Item>(this.API, formData, { headers })
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
        map(retorno => retorno),
      );
  }

  update(id: number, item: Item) {
    console.log("Item to update:", item);
    const body = this.sanitize(item);
    console.log("Sanitized body:", body);

    const formData = new FormData();
    
    // Separa a imagem do resto dos dados
    const { coverImageFile, ...itemData } = body;
    
    // Adiciona o item como um Blob JSON
    const itemBlob = new Blob([JSON.stringify(itemData)], {
      type: 'application/json'
    });
    formData.append('item', itemBlob);
    
    // Adiciona a imagem se existir
    if (coverImageFile) {
      formData.append('coverImageFile', coverImageFile, coverImageFile.name);
    }

    // Configura os headers para multipart/form-data
    const headers = {
      Accept: 'application/json',
    };

    return this.httpClient.put<Item>(`${this.API}/${id}`, formData, { headers })
      .pipe(
        first(),
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
  }

  getCoverImageUrl(coverImagePath: string): string {
    // The backend now returns full S3 URLs
    if (!coverImagePath) return '';
    return coverImagePath;
  }

  getItemById(id: number) {
    return this.httpClient.get<any>(`${this.API}/${id}`)
      .pipe(
        first(),
        map(result => result['data'] as Item)
      )
  }

  getByImagePath(imagePath: string) {
    return this.httpClient.get<any>(`${this.API}/by-image-path`, {
      params: { imagePath }
    }).pipe(
      first(),
      map(result => result['data'])
    );
  }

  listAll() {
    return this.httpClient.get<any>(`${this.API}`)
      .pipe(
        first(),
        map(result => {
          console.log('Raw API response:', result);
          const items = result['data'] as Item[];
          console.log('Mapped items:', items);
          return items;
        })
      );
  }

  sanitize(value: any) {
    const body = { ...value }
    if (body.title) body.title = body.title.trim()
    if (body.releaseYear) body.releaseYear = body.releaseYear
    if (body.country) body.country = body.country.trim()
    if (body.genre) body.genre = body.genre.trim()

    // CORREÇÃO: Tratar string vazia e objetos inválidos como null
    if (body.category && typeof body.category === 'object' && body.category.id) {
      body.category = { id: body.category.id }
    } else {
      body.category = null;
    }

    if (body.artist && typeof body.artist === 'object' && body.artist.id) {
      body.artist = { id: body.artist.id }
    } else {
      body.artist = null;
    }

    // Se não tem artist mas tem artistName, mantém o artistName para criar novo artista
    if (body.artistName) {
      body.artistName = body.artistName.trim();
    }

    // Discogs fields
    if (body.labelName) body.labelName = body.labelName.trim();

    // Ensure tracks array is properly formatted
    if (body.tracks && Array.isArray(body.tracks)) {
      body.tracks = body.tracks.map((track: any, index: number) => ({
        position: track.position || String(index + 1),
        title: track.title?.trim() || '',
        duration: track.duration || '',
        trackOrder: track.trackOrder || index + 1
      }));
    }

    // Ensure credits array is properly formatted
    if (body.credits && Array.isArray(body.credits)) {
      body.credits = body.credits.map((credit: any) => ({
        name: credit.name?.trim() || '',
        role: credit.role?.trim() || '',
        discogsArtistId: credit.discogsArtistId || null
      }));
    }

    return body;
  }

}
