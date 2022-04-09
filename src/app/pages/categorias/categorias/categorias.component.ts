import { Component, OnInit } from '@angular/core';
import { Categoria } from '../model/categoria';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  categorias: Categoria[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
