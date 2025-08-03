import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
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
  @ViewChild('fileUpload') fileUpload: FileUpload;

  id: number;

  item: Item;

  itemForm: FormGroup;
  selectedFiles: File[];
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
      coverImageFile: this.selectedFiles ? this.selectedFiles[0] : null
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

          // Reset the selected files
          this.selectedFiles = null;
          // Reset the form
          this.itemForm.reset();
          // Rebuild the form with clean state
          this.buildForm();
          // Clear the file upload component
          if (this.fileUpload) {
            this.fileUpload.clear();
          }
        },
        errorResponse => {
          this.onInfo(errorResponse.error.data);
          console.log(errorResponse.error.data);
        });
    }
  }

  onUpload($event) {
    if ($event.files && $event.files.length > 0) {
      const file = $event.files[0];
      console.log("Arquivo selecionado:", {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      // Armazena o arquivo diretamente
      this.itemForm.patchValue({
        coverImageFile: file
      });
      
      this.messageService.add({
        severity: 'info',
        summary: 'Sucesso',
        detail: `Imagem "${file.name}" selecionada com sucesso.`
      });
    }
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
  get coverImageFile(): string { return this.camposForm.coverImageFile.value; }

}
