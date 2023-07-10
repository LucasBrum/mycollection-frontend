import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { Item } from '../model/item';


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
    console.log(">>>>>>>>> ITEM ", item)
    const body = this.sanitize(item);

    console.log(">>>>>>>>> BODY ", body)

    var formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(body)], {type: 'application/json'}));
    formData.append('coverImage', body.coverImage);

    return this.httpClient.post<Item>(this.API, formData)
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
    console.log(">>>>>>>>> ITEM ", item)
    const body = this.sanitize(item);

    console.log(">>>>>>>>> BODY ", body)

    var formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(body)], {type: 'application/json'}));
    formData.append('coverImage', body.coverImage);
    return this.httpClient.put<Item>(`${this.API}/${id}`, formData)
      .pipe(
        first(),
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
  }

  getCoverFromAlbum(id: number) {
    return this.httpClient.get(`${this.API}/cover/${id}`, { responseType: 'text' })
//    .pipe(
//      first(),
//     map(result => result['data'])
//      )
  }

  getItemById(id: number) {
    return this.httpClient.get<Item[]>(`${this.API}/${id}`)
      .pipe(
        first(),
        map(result => result['data'])
      )
  }

  sanitize(value: any) {
    const body = { ...value }
    if (body.title) body.title = body.title.trim()
    if (body.releaseYear) body.releaseYear = body.releaseYear
    if (body.country) body.country = body.country.trim()
    if (body.genre) body.genre = body.genre.trim()

    if (body.category) {
      body.category = { id: body.category.id }
    }

    if (body.artist) {
      body.artist = { id: body.artist.id }
    }
    return body;
  }

}
