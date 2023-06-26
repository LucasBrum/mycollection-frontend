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
    return this.httpClient.post<Item>(this.API, item)
      .pipe(
        first(),
        tap(() => {
          this._refreshNeeded$.next();
        })
      );

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
    return this.httpClient.put(`${this.API}/${id}`, item)
      .pipe(
        first(),
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
  }

  getItemById(id: number) {
    return this.httpClient.get<Item[]>(`${this.API}/${id}`)
      .pipe(
        first(),
        map(result => result['data'])
      )
  }

}
