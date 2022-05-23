import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, first, map } from 'rxjs/operators';

import { Categoria } from '../model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly API = 'mycollection/api/categories';

  constructor(private httpClient: HttpClient) { }

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
        first()
      );
      
  }
}
