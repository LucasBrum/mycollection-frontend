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

  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.categoriaService.list().subscribe(categorias => this.categorias = categorias);
  }

}
