import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';

import { Categoria } from '../../categorias/model/categoria';
import { CategoriaService } from '../../categorias/services/categoria.service';
import { ArtistService } from '../services/artist.service';

@Component({
  selector: 'app-artist-form',
  templateUrl: './artist-form.component.html',
  styleUrls: ['./artist-form.component.scss'],
  providers: [MessageService]
})
export class ArtistFormComponent implements OnInit {

  categorias: Categoria[] = [];
  selectedCategory: Categoria;

  countries: any[] = [];

  artistForm: FormGroup;
  pristine = true;

  constructor(
    private artistService: ArtistService,
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.listCategories();
    this.listCountries();
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
  
  save() {
    this.artistService.save(this.artistForm.value)
      .subscribe(result => {
        this.messageService.add({
          severity:'success',
          summary:'Sucesso',
          detail:'Álbum cadastro com sucesso.'
        });
      },
      error => {this.onError('Erro ao cadastrar Álbum.')}
      )

      this.artistForm.reset();
      
  }

  listCategories() {
    this.categoriaService.list()
      .subscribe(categorias => this.categorias = categorias);
  }

  listCountries() {
    this.artistService.listCountries()
      .subscribe(countries => this.countries = countries);
  }

  private onError(message: string) {
    const msg = message;
    this.messageService.add({
      severity:'error',
      summary:'Erro',
      detail:msg,
      life:5000
    })
  }

  get camposForm(): any { return this.artistForm.controls; }
  get band(): string { return this.camposForm.band.value; }
  get title(): string { return this.camposForm.title.value; }
  get releaseYear(): string { return this.camposForm.releaseYear.value; }
  get country(): string { return this.camposForm.country.value; }
  get genre(): string { return this.camposForm.genre.value; }
  get category(): string { return this.camposForm.category.value; }

  

}
