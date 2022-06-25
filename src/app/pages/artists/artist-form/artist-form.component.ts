import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoriasComponent } from '../../categorias/categorias/categorias.component';
import { Categoria } from '../../categorias/model/categoria';
import { CategoriaService } from '../../categorias/services/categoria.service';

@Component({
  selector: 'app-artist-form',
  templateUrl: './artist-form.component.html',
  styleUrls: ['./artist-form.component.scss']
})
export class ArtistFormComponent implements OnInit {

  categorias: Categoria[] = [];
  selectedCategory: Categoria;

  artistForm: FormGroup;
  pristine = true;

  constructor(
    private categoriaService: CategoriaService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.listCategories();
  }

  buildForm() {
    this.artistForm = this.formBuilder.group({
      band: ['', Validators.required],
      title: ['', Validators.required],
      releaseYear: ['', Validators.required],
      country: ['', Validators.required],
      genre: ['', Validators.required],
      category: ['', Validators.required]
    })
  }

  listCategories() {
    this.categoriaService.list()
      .subscribe(categorias => this.categorias = categorias);
  }

  get camposForm(): any { return this.artistForm.controls; }
  get band(): string { return this.camposForm.band.value; }
  get title(): string { return this.camposForm.title.value; }
  get releaseYear(): string { return this.camposForm.releaseYear.value; }
  get country(): string { return this.camposForm.country.value; }
  get genre(): string { return this.camposForm.genre.value; }
  get category(): string { return this.camposForm.category.value; }

}
