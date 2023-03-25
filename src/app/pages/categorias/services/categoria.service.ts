import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly API = 'mycollection/api/categories';

  private _refreshNeeded$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refreshNeeded$() {
    return this._refreshNeeded$;
  }

  list() {
    return this.httpClient.get<Category[]>(this.API)
    .pipe(
      first(),
      map(result => result['data'])

      );

  }

  save(categoria: Category) {
    return this.httpClient.post<Category>(this.API, categoria)
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

  update(id: number, category: Category) {
    return this.httpClient.put(`${this.API}/${id}`, category)
      .pipe(
        first(),
        tap(() => {
          this._refreshNeeded$.next();
        })
      )
  }

}
