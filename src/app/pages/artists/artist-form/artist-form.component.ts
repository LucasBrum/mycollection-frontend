import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';

import { Category } from '../../categorias/model/category';
import { CategoriaService } from '../../categorias/services/categoria.service';
import { ArtistsComponent } from '../artists/artists.component';
import { Artist } from '../model/artist';
import { ArtistService } from '../services/artist.service';

@Component({
  selector: 'app-artist-form',
  templateUrl: './artist-form.component.html',
  styleUrls: ['./artist-form.component.scss'],
  providers: [MessageService]
})
export class ArtistFormComponent implements OnInit {

  @ViewChild('artistsGrid') artistsGrid: ArtistsComponent;

  id: number;

  artist: Artist;

  artistForm: FormGroup;

  countries: any[] = [];
  categorias: Category[] = [];
  selectedCategory: Category;

  pristine = true;

  constructor(
    private router: Router,
    private artistService: ArtistService,
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private activatedRoute : ActivatedRoute

  ) {
  }

  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params
      params.subscribe(urlParams => {
        this.id = urlParams['id'];
        if (this.id) {
          this.artistService.getArtistById(this.id)
          .subscribe(artist => this.setArtistFormToEdit(artist),
          err => console.log(err))
        }
        console.log(this.artist);
      })

    this.buildForm();
    this.listCategories();
    this.listCountries();
  }

  setArtistFormToEdit(artist: Artist) {
    this.artist = artist;
    console.log("Entrei no SET", artist);
    if (artist) {
      this.artistForm.patchValue({
        id: artist._id,
        band: artist.band,
        category: artist.category,
        country: artist.country,
        genre: artist.genre,
        releaseYear: artist.releaseYear,
        title: artist.title
      });
    }
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
    if(this.id) {
      this.updateArtist();
    } else {
      this.artistService.save(this.artistForm.value)
        .subscribe(result => {
          this.messageService.add({
            severity:'success',
            summary:'Sucesso',
            detail:'Álbum cadastro com sucesso.'
          });

          this.router.navigate(['/artists'])
        },
        errorResponse => {
          this.onInfo(errorResponse.error.data);
          console.log(errorResponse.error.data);
        });

    }

  }

  private updateArtist() {
    this.artistService.update(this.artist['id'], this.artistForm.value)
      .subscribe(result => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Álbum atualizado com sucesso.'
        });
      },
        error => { this.onError('Erro ao cadastrar Álbum.'); }
      );

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
    console.log('enterei no on error <<<<<<<<<<<<<<<<<<<<', msg)
    this.messageService.add({
      severity:'error',
      summary:'Erro',
      detail:msg,
      life:5000
    })
  }

  private onInfo(message: string) {
    const msg = message;
    console.log('[log]Info====', msg)
    this.messageService.add({
      severity:'info',
      summary:'Info',
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
