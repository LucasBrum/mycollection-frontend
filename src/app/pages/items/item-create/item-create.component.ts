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

  async ngOnInit(): Promise<void> {
    this.buildForm();
    
    // Se não estiver em modo de edição, carrega os dados relacionados imediatamente
    if (!this.activatedRoute.snapshot.params['id']) {
      await Promise.all([
        this.listCategories(),
        this.listCountries(),
        this.listArtists()
      ]);
    }

    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.itemService.getItemById(this.id).subscribe(
          item => {
            if (item) {
              console.log('Item loaded for edit:', item);
              this.setItemFormToEdit(item);
            } else {
              this.handleItemNotFound();
            }
          },
          error => {
            console.error('Error loading item:', error);
            if (error.status === 404) {
              this.handleItemNotFound();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar item para edição. Por favor, tente novamente.'
              });
            }
          }
        );
      }
    });
  }

  setItemFormToEdit(item: Item) {
    console.log("Setting form to edit with item:", item);
    if (item) {
      this.item = item;
      // Aguarda os dados relacionados serem carregados
      Promise.all([
        this.listCategories(),
        this.listArtists()
      ]).then(() => {
        this.itemForm.patchValue({
          title: item.title,
          releaseYear: item.releaseYear,
          genre: item.genre,
          category: item.category,
          artist: item.artist,
          coverImagePath: item.coverImagePath
        });
      });
    }
  }

  buildForm() {
    this.pristine = true;
    this.itemForm = this.formBuilder.group({
      artist: ['', Validators.required],
      title: ['', Validators.required],
      releaseYear: ['', Validators.required],
      genre: ['', Validators.required],
      category: ['', Validators.required],
      coverImagePath: [''],
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

  listCategories(): Promise<void> {
    return new Promise((resolve) => {
      this.categoriaService.list()
        .subscribe(categorias => {
          this.categorias = categorias;
          resolve();
        });
    });
  }

  listCountries(): Promise<void> {
    return new Promise((resolve) => {
      this.artistService.list()
        .subscribe(countries => {
          this.countries = countries;
          resolve();
        });
    });
  }

  listArtists(): Promise<void> {
    return new Promise((resolve) => {
      this.artistService.list().subscribe(artists => {
        this.artists = artists;
        console.log('ARTISTS >>> ', artists);
        resolve();
      });
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

  private handleItemNotFound() {
    this.messageService.add({
      severity: 'error',
      summary: 'Item não encontrado',
      detail: 'O item que você está tentando editar não foi encontrado.',
      life: 5000
    });
    // Redireciona de volta para a lista após um breve delay
    setTimeout(() => {
      this.router.navigate(['/items']);
    }, 1500);
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
