import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Item } from '../model/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../categorias/model/category';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ItemService } from '../services/item.service';
import { CategoriaService } from '../../categorias/services/categoria.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { ArtistService } from '../../artists/services/artist.service';
import { Artist } from '../../artists/model/artist';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  providers: [MessageService],
  styleUrls: ['./item-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemCreateComponent implements OnInit {

  id: number;

  item: Item;

  itemForm: FormGroup;
  coverImageFile: File[];
  artists: Artist[] = [];
  countries: any[] = [];
  categorias: Category[] = [];
  selectedCategory: Category;

  pristine = true;

  constructor(
    private router: Router,
    private itemService: ItemService,
    private artistService: ArtistService,
    private categoriaService: CategoriaService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private activatedRoute : ActivatedRoute

  ) {}

  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params
      params.subscribe(urlParams => {
        this.id = urlParams['id'];
        if (this.id) {
          this.itemService.getItemById(this.id)
          .subscribe(artist => this.setArtistFormToEdit(artist),
          err => console.log(err))
        }
      })

    this.buildForm();
    this.listCategories();
    this.listCountries();
    this.listArtists();
  }

  setArtistFormToEdit(item: Item) {
    this.item = item;
    console.log("Entrei no SET", item);
    if (item) {
      this.itemForm.patchValue({
        id: item._id,
        title: item.title,
        releaseYear: item.releaseYear,
        genre: item.genre,
        category: item.category,
        artist: item.artist
      });
    }
  }

  buildForm() {
    //console.log(">>>>>>>> Cover Image File", this.coverImageFile)
    this.itemForm = this.formBuilder.group({
      artist: ['', Validators.required],
      title: ['', Validators.required],
      releaseYear: ['', Validators.required],
      genre: ['', Validators.required],
      category: ['', Validators.required],
      coverImage: this.coverImageFile ? this.coverImageFile[0] : null
    })

  }

  save() {
    console.log('this.itemForm.value ================ ', this.itemForm.value);
    if(this.id) {
      this.updateItem();
    } else {
      this.itemService.save(this.itemForm.value)
        .subscribe(result => {
          this.messageService.add({
            severity:'success',
            summary:'Sucesso',
            detail:'Item cadastrado com sucesso.'
          });

          this.router.navigate(['/items'])
        },
        errorResponse => {
          this.onInfo(errorResponse.error.data);
          console.log(errorResponse.error.data);
        });

    }

  }

  saveAnother() {
    console.log('this.artistForm.value ================ ', this.itemForm.value);
    if(this.id) {
      this.updateItem();
    } else {
      this.itemService.save(this.itemForm.value)
        .subscribe(result => {
          this.messageService.add({
            severity:'success',
            summary:'Sucesso',
            detail:'Item cadastrado com sucesso.'
          });

          this.buildForm();
          this.itemForm.reset();
        },
        errorResponse => {
          this.onInfo(errorResponse.error.data);
          console.log(errorResponse.error.data);
        });

    }

  }

  onUpload($event) {
    console.log("Arquivo de imagem selecionado...", $event.files)
    this.coverImageFile = $event.files
    this.messageService.add({severity: 'info', summary: 'Sucesso', detail: 'Upload da imagem efetuado com sucesso.'});
    this.itemForm.patchValue({
      coverImage: $event.files[0]
    })
  }

  private updateItem() {
    console.log("THIS ITEM FORM VALUE ",  this.itemForm.value)
    this.itemService.update(this.item['id'], this.itemForm.value)
      .subscribe(result => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Item atualizado com sucesso.'
        });

        this.router.navigate(['/items'])
      },
        error => { this.onError('Erro ao atualizar Item.'); }
      );

    this.itemForm.reset();
  }

  listCategories() {
    this.categoriaService.list()
      .subscribe(categorias => this.categorias = categorias);
  }

  listCountries() {
    this.artistService.list()
      .subscribe(countries => {
        this.countries = countries
      });

  }

  listArtists() {
    this.artistService.list().subscribe(artists => {
      this.artists = artists
      console.log('ARTISTS >>> ', artists);
    });

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

  get camposForm(): any { return this.itemForm.controls; }
  get artist(): string { return this.camposForm.artist.value; }
  get title(): string { return this.camposForm.title.value; }
  get releaseYear(): string { return this.camposForm.releaseYear.value; }
  get genre(): string { return this.camposForm.genre.value; }
  get category(): string { return this.camposForm.category.value; }
  get coverImage(): string { return this.camposForm.coverImage.value; }

}
