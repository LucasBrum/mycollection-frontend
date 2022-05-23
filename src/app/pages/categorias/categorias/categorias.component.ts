import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
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

  @ViewChild('tabela', {static: true}) grid: Table;

  displayModal: boolean;

  categorias$: Observable<Categoria[]>;

  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.list();
  }

  ngOnInit(): void {}

  list() {
    this.categorias$ = this.categoriaService.list()
      catchError((error) => {
        this.showError();
        console.log(error);
        return of([]);
      })

  }

  showModalDialog() {
    this.displayModal = true;
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Erro ao carregar lista de Categorias.',
      life: 7000
    });
  }
}
