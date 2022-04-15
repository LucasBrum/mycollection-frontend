import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Categoria } from '../model/categoria';
import { CategoriaService } from './../services/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  providers: [MessageService],
})
export class CategoriasComponent implements OnInit {
  categorias$: Observable<Categoria[]>;

  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService
  ) {
    this.categorias$ = this.categoriaService.list().pipe(
      catchError((error) => {
        this.showError();
        console.log(error);
        return of([]);
      })
    );
  }

  ngOnInit(): void {}

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Erro ao carregar lista de Categorias.',
      life: 7000
    });
  }
}
