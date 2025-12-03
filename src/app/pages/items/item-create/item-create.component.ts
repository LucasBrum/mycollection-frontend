import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Item, Track, Credit } from '../model/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../categorias/model/category';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ItemService } from '../services/item.service';
import { CategoriaService } from '../../categorias/services/categoria.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { ArtistService } from '../../artists/services/artist.service';
import { Artist } from '../../artists/model/artist';
import { DiscogsRelease, DiscogsFormat } from '../model/discogs';
import { DiscogsService } from '../services/discogs.service';

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
  categorias: Category[] = [];
  selectedCategory: Category;
  imagePreview: string | ArrayBuffer | null = null;
  isDragging: boolean = false;

  pristine = true;

  // Discogs integration
  showDiscogsDialog: boolean = false;
  discogsRelease: DiscogsRelease | null = null;
  tracks: Track[] = [];
  credits: Credit[] = [];
  showAllCredits: boolean = false;
  showAllTracks: boolean = false;

  constructor(
    private router: Router,
    private itemService: ItemService,
    private artistService: ArtistService,
    private categoriaService: CategoriaService,
    private discogsService: DiscogsService,
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
        // Encontra os objetos completos nas listas carregadas
        // O backend retorna 'id' mas a lista também pode usar '_id'
        const categoryIdFromBackend = (item.category as any)?.id || item.category?._id;
        const artistIdFromBackend = (item.artist as any)?.id || item.artist?._id;

        const selectedArtist = this.artists.find(a => {
          const artistId = a._id || (a as any).id;
          return artistId === artistIdFromBackend;
        });

        const selectedCategory = this.categorias.find(c => {
          const categoryId = c._id || (c as any).id;
          return categoryId === categoryIdFromBackend;
        });

        this.itemForm.patchValue({
          title: item.title,
          releaseYear: item.releaseYear,
          genre: item.genre,
          category: selectedCategory,
          artist: selectedArtist,
          coverImagePath: item.coverImagePath
        });

        // Set image preview if cover exists
        if (item.coverImagePath) {
          this.imagePreview = item.coverImagePath;
        }
      });
    }
  }

  buildForm() {
    this.pristine = true;
    this.itemForm = this.formBuilder.group({
      artist: [null],       // null em vez de '' para evitar erro de coerção
      artistName: [''],     // Nome do artista para criar novo se não existir
      artistCountry: [''],  // País do artista (do Discogs)
      title: ['', Validators.required],
      releaseYear: ['', Validators.required],
      genre: ['', Validators.required],
      category: [null, Validators.required],     // null em vez de '' para evitar erro de coerção
      coverImagePath: [''],
      coverImageFile: this.selectedFiles ? this.selectedFiles[0] : null,
      // Discogs fields
      discogsReleaseId: [null],
      discogsMasterId: [null],
      discogsImageUrl: [''],
      labelName: [''],
      discogsLabelId: [null],
      tracks: [[]],
      credits: [[]]
    });
  }

  openDiscogsDialog(): void {
    this.showDiscogsDialog = true;
  }

  onDiscogsReleaseSelected(release: DiscogsRelease): void {
    console.log('Discogs release selected:', release);
    this.discogsRelease = release;

    // Extract artist name and ID (remove Discogs suffix like "(2)")
    const artistName = release.artists?.[0]?.name?.replace(/\s*\(\d+\)$/, '') || '';
    const discogsArtistId = release.artists?.[0]?.id;

    // Find existing artist in local list
    let selectedArtist = this.artists.find(a =>
      a.name.toLowerCase() === artistName.toLowerCase()
    );

    // Get cover image URL
    const coverImageUrl = this.getDiscogsImageUrl(release);
    if (coverImageUrl) {
      this.imagePreview = coverImageUrl;
    }

    // Map tracks
    this.tracks = (release.tracklist || []).map((track, index) => ({
      position: track.position || String(index + 1),
      title: track.title,
      duration: track.duration || '',
      trackOrder: index + 1
    }));

    // Map credits
    this.credits = (release.extraartists || []).map(credit => ({
      name: credit.name?.replace(/\s*\(\d+\)$/, '') || '',
      role: credit.role || '',
      discogsArtistId: credit.id
    }));

    // Get label info
    const label = release.labels?.[0];
    const labelName = label?.name || '';
    const discogsLabelId = label?.id || null;

    // Auto-selecionar categoria baseado no formato do Discogs
    const selectedCategory = this.mapDiscogsFormatToCategory(release.formats);

    // Update form with Discogs data (artistCountry será atualizado depois se necessário)
    this.itemForm.patchValue({
      title: release.title,
      releaseYear: release.year,  // Será atualizado pelo Master se disponível
      genre: release.styles?.join(', ') || '',
      artist: selectedArtist || null,
      artistName: selectedArtist ? '' : artistName,
      artistCountry: '',  // Será preenchido pela API do artista
      category: selectedCategory,
      discogsReleaseId: release.id,
      discogsMasterId: release.masterId,
      discogsImageUrl: coverImageUrl,
      labelName: labelName,
      discogsLabelId: discogsLabelId,
      tracks: this.tracks,
      credits: this.credits
    });

    // Se existe masterId, busca o Master Release para obter o ano original de lançamento
    if (release.masterId) {
      this.discogsService.getMasterDetails(release.masterId).subscribe({
        next: (master) => {
          if (master.year) {
            this.itemForm.patchValue({ releaseYear: master.year });
            console.log(`Ano original do Master: ${master.year} (release tinha: ${release.year})`);
          }
        },
        error: (err) => {
          console.warn('Erro ao buscar Master Release, usando ano do release:', err);
          // Mantém o ano do release como fallback
        }
      });
    }

    // Se artista não existe localmente e temos o ID do Discogs, busca detalhes para obter o país
    if (!selectedArtist && artistName && discogsArtistId) {
      this.discogsService.getArtistDetails(discogsArtistId).subscribe({
        next: (artistDetails) => {
          const country = this.extractCountryFromProfile(artistDetails.profile);
          if (country) {
            this.itemForm.patchValue({ artistCountry: country });
            console.log(`País do artista extraído do profile: ${country}`);
          }
          this.messageService.add({
            severity: 'info',
            summary: 'Novo Artista',
            detail: `Artista "${artistName}"${country ? ` (${country})` : ''} será criado automaticamente ao salvar.`,
            life: 5000
          });
        },
        error: (err) => {
          console.error('Erro ao buscar detalhes do artista:', err);
          this.messageService.add({
            severity: 'info',
            summary: 'Novo Artista',
            detail: `Artista "${artistName}" será criado automaticamente ao salvar.`,
            life: 5000
          });
        }
      });
    } else if (!selectedArtist && artistName) {
      this.messageService.add({
        severity: 'info',
        summary: 'Novo Artista',
        detail: `Artista "${artistName}" será criado automaticamente ao salvar.`,
        life: 5000
      });
    }

    // If category not found, show message
    if (!selectedCategory && release.formats?.length) {
      const formatName = release.formats[0]?.name || 'Desconhecido';
      this.messageService.add({
        severity: 'warn',
        summary: 'Categoria',
        detail: `Formato "${formatName}" não mapeado. Por favor, selecione uma categoria.`,
        life: 5000
      });
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Dados do Discogs importados: ${release.title}`,
      life: 3000
    });
  }

  /**
   * Mapeia o formato do Discogs para uma categoria do sistema
   * O Discogs retorna formats como array de objetos: [{name: "CD", qty: "1", descriptions: ["Album"]}]
   */
  private mapDiscogsFormatToCategory(formats: DiscogsFormat[]): Category | null {
    if (!formats || formats.length === 0) return null;

    // Mapeamento Discogs format.name -> Nome da categoria no sistema
    const mapping: { [key: string]: string } = {
      'cd': 'CD',
      'vinyl': 'Vinyl',
      'dvd': 'DVD',
      'blu-ray': 'Blu-Ray',
      'cassette': 'Cassette',
      'sacd': 'CD',
    };

    // Procura em todos os formatos retornados
    for (const format of formats) {
      const formatName = format.name?.toLowerCase() || '';

      // Primeiro, tenta mapear pelo nome do formato (CD, Vinyl, DVD, etc.)
      for (const [discogsFormat, categoryName] of Object.entries(mapping)) {
        if (formatName.includes(discogsFormat)) {
          const foundCategory = this.categorias.find(c =>
            c.name.toLowerCase() === categoryName.toLowerCase()
          );
          if (foundCategory) {
            return foundCategory;
          }
        }
      }

      // Se não encontrou pelo nome, verifica as descriptions (LP, 12", 7", Album, etc.)
      if (format.descriptions && format.descriptions.length > 0) {
        for (const desc of format.descriptions) {
          const descLower = desc.toLowerCase();
          if (descLower.includes('lp') || descLower.includes('12"') ||
              descLower.includes('10"') || descLower.includes('7"')) {
            const foundCategory = this.categorias.find(c =>
              c.name.toLowerCase() === 'vinyl'
            );
            if (foundCategory) {
              return foundCategory;
            }
          }
        }
      }
    }

    return null;
  }

  private getDiscogsImageUrl(release: DiscogsRelease): string {
    if (release.images && release.images.length > 0) {
      const primaryImage = release.images.find(img => img.type === 'primary');
      return primaryImage?.uri || release.images[0].uri;
    }
    return '';
  }

  /**
   * Extrai o país do artista a partir do texto do profile do Discogs.
   * O profile geralmente começa com nacionalidades como "American", "British", "German", etc.
   */
  private extractCountryFromProfile(profile: string | undefined): string {
    if (!profile) return '';

    // Mapeamento de nacionalidades para países
    const nationalityToCountry: { [key: string]: string } = {
      'american': 'USA',
      'us': 'USA',
      'u.s.': 'USA',
      'united states': 'USA',
      'british': 'UK',
      'english': 'UK',
      'scottish': 'UK',
      'welsh': 'UK',
      'uk': 'UK',
      'united kingdom': 'UK',
      'german': 'Germany',
      'canadian': 'Canada',
      'australian': 'Australia',
      'french': 'France',
      'italian': 'Italy',
      'spanish': 'Spain',
      'japanese': 'Japan',
      'swedish': 'Sweden',
      'norwegian': 'Norway',
      'danish': 'Denmark',
      'dutch': 'Netherlands',
      'belgian': 'Belgium',
      'swiss': 'Switzerland',
      'austrian': 'Austria',
      'irish': 'Ireland',
      'brazilian': 'Brazil',
      'mexican': 'Mexico',
      'argentinian': 'Argentina',
      'chilean': 'Chile',
      'colombian': 'Colombia',
      'portuguese': 'Portugal',
      'russian': 'Russia',
      'polish': 'Poland',
      'finnish': 'Finland',
      'icelandic': 'Iceland',
      'new zealand': 'New Zealand',
      'south african': 'South Africa',
      'korean': 'South Korea',
      'chinese': 'China',
      'indian': 'India'
    };

    const profileLower = profile.toLowerCase();

    // Procura pela nacionalidade no início do profile (primeiras 100 caracteres)
    const profileStart = profileLower.substring(0, 100);

    for (const [nationality, country] of Object.entries(nationalityToCountry)) {
      if (profileStart.includes(nationality)) {
        return country;
      }
    }

    return '';
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

          // Reset all states for a new item
          this.selectedFiles = null;
          this.imagePreview = null;
          this.tracks = [];
          this.credits = [];

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

      // Generate image preview
      this.generateImagePreview(file);

      this.messageService.add({
        severity: 'info',
        summary: 'Sucesso',
        detail: `Imagem "${file.name}" selecionada com sucesso.`
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.itemForm.patchValue({
          coverImageFile: file
        });
        this.generateImagePreview(file);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Imagem "${file.name}" adicionada com sucesso.`
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Por favor, selecione apenas arquivos de imagem.'
        });
      }
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.itemForm.patchValue({
        coverImageFile: file
      });
      this.generateImagePreview(file);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Imagem "${file.name}" selecionada com sucesso.`
      });
    }
  }

  generateImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.imagePreview = null;
    this.itemForm.patchValue({
      coverImageFile: null
    });
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
    this.messageService.add({
      severity: 'info',
      summary: 'Removido',
      detail: 'Imagem removida com sucesso.'
    });
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
  get artist(): Artist { return this.camposForm.artist.value; }
  get title(): string { return this.camposForm.title.value; }
  get releaseYear(): string { return this.camposForm.releaseYear.value; }
  get genre(): string { return this.camposForm.genre.value; }
  get category(): Category { return this.camposForm.category.value; }
  get coverImageFile(): string { return this.camposForm.coverImageFile.value; }

}
