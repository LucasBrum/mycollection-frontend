import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  displayModal: boolean;

  categorias$: Observable<Categoria[]>;

  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categorias$ = this.categoriaService.list()
      catchError((error) => {
        this.showError();
        console.log(error);
        return of([]);
      })
  }

  ngOnInit(): void {}

  // cadastrar() {
  //   this.router.navigate(['cadastrar'], {relativeTo: this.route});
  // }

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
