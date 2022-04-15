import { CategoriaService } from './../services/categoria.service';
import { Component, OnInit } from '@angular/core';
import { Categoria } from '../model/categoria';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  categorias$: Observable<Categoria[]>;

  constructor(private categoriaService: CategoriaService) {
    this.categorias$ = this.categoriaService.list();
  }

  ngOnInit(): void {

  }

}
