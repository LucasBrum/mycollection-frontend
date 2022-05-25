import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

import { Categoria } from '../model/categoria';

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
    return this.httpClient.get<Categoria[]>(this.API)
      .pipe(
        first(),
        map(result => result['data'])

    );
  }

  save(categoria: Categoria) {
    return this.httpClient.post<Categoria>(this.API, categoria)
      .pipe(
        first(),
        tap(() => {
          this._refreshNeeded$.next();
        })
      );
      
  }
}
