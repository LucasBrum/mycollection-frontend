import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';

import { Categoria } from '../model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly API = '../../../../assets/categorias.json';

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Categoria[]>(this.API)
      .pipe(
        first()
      );
  }
}


