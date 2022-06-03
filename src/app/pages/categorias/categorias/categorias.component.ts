import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ConfirmationService} from 'primeng/api';
import { Categoria } from '../model/categoria';
import { CategoriaService } from './../services/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class CategoriasComponent implements OnInit {

  @ViewChild('tabela', {static: true}) grid: Table;

  displayModal: boolean;

  categorias$: Observable<Categoria[]>;
  categoria: Categoria;

  constructor(
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoriaService.refreshNeeded$.subscribe(() => {
      this.list();
    })

    this.list();

  }

  list() {
    this.categorias$ = this.categoriaService.list()
      catchError((error) => {
        this.showError('Erro ao carregar lista de Categorias.');
        return of([]);
      })

  }

  delete(categoria: Categoria): void {
    const categoriaId = categoria['id'];
    this.confirmationService.confirm({
      message: 'Deseja realmente deletar a categoria ${categoria.name}.',
      accept: () => {
        this.categoriaService.delete(categoriaId).subscribe(
          response => {
            this.messageService.add({
              severity: 'success',
              summary:'Sucesso',
              detail: 'Categoria deletada com sucesso!'
            })
            this.categoriaService.refreshNeeded$;
          },
          error => {this.onError('Erro ao deletar Categoria.')}
        )}
    });
  }

  private onError(message: string) {
    const msg = message;
    this.messageService.add({
      severity:'error', 
      summary:'Erro', 
      detail: message, 
      life:5000
    })
  }

  showModalDialog() {
    this.displayModal = true;
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 7000
    });
  }
}
