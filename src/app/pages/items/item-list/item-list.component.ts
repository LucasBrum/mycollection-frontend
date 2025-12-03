import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { ArtistItemDetailsResponse } from '../../artists/model/ArtistItemDetailsResponse';
import { ArtistService } from '../../artists/services/artist.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Item } from '../model/item';
import { ItemService, ItemWithCoverImage } from '../services/item.service';
import { Artist } from '../../artists/model/artist';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ItemListComponent implements OnInit {
  collapsed = true; // Estado do menu lateral

  // No longer need ENDPOINT_GET_COVER_IMAGE as we use the coverImagePath from the backend

  display: boolean = false;
  displayDetails: boolean = false;
  selectedItemDetails: Item | null = null;
  loading: boolean = false;

  showDialog() {
      this.display = true;
  }

  selectedItem: Item;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  @ViewChild('tabela', {static: true}) grid: Table;
  @Output() editar: EventEmitter<number> = new EventEmitter();

  items: Item[] = [];
  filteredItems: Item[] = [];
  paginatedItems: Item[] = [];
  menuItems: MenuItem[];

  // Filtros e busca
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedArtist: Artist | null = null;
  categoriesFilter: string[] = [];
  categoriesFilterOptions: string[] = [];
  artistsFilter: Artist[] = [];
  artistsFilterOptions: Artist[] = [];

  // Visualização
  viewMode: 'grid' | 'list' = 'grid';

  // Paginação
  currentPage: number = 0;
  itemsPerPage: number = 12;

  constructor(
    private artistService: ArtistService,
    private itemService: ItemService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.menuItems = [
      {
          label: 'Cadastrar',
          icon: 'pi pi-refresh',
          routerLink: ['/items/create'],
      }
    ];
    this.itemService.refreshNeeded$.subscribe(() => {
      this.list();
    })
    this.list();
  }

  list() {
    this.loading = true;
    // Usar o endpoint que retorna os itens completos
    this.itemService.listAll().subscribe({
      next: (items) => {
        console.log('Items loaded:', items);
        this.items = items;
        this.filteredItems = items;
        this.extractFilters();
        this.updatePaginatedItems();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de álbuns.',
          life: 3000
        });
        this.loading = false;
      }
    });
  }

  extractFilters() {
    // Extrair categorias únicas
    const categories = new Set<string>();
    const artists: Artist[] = [];
    const artistIds = new Set<number>();

    this.items.forEach(item => {
      if (item.category?.name) {
        categories.add(item.category.name);
      }
      if (item.artist && item.artist._id && !artistIds.has(item.artist._id)) {
        artistIds.add(item.artist._id);
        artists.push(item.artist);
      }
    });

    this.categoriesFilter = Array.from(categories).sort();
    this.artistsFilter = artists.sort((a, b) => a.name.localeCompare(b.name));

    // Criar opções com "Todas" no início
    this.categoriesFilterOptions = ['Todas Categorias', ...this.categoriesFilter];
    this.artistsFilterOptions = [
      { _id: 0, name: 'Todos Artistas' } as Artist,
      ...this.artistsFilter
    ];
  }

  applyFilters() {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = this.matchesSearchTerm(item);
      const matchesCategory = !this.selectedCategory ||
                              this.selectedCategory === 'Todas Categorias' ||
                              item.category?.name === this.selectedCategory;
      const matchesArtist = !this.selectedArtist ||
                            this.selectedArtist._id === 0 ||
                            item.artist?._id === this.selectedArtist._id;

      return matchesSearch && matchesCategory && matchesArtist;
    });

    this.currentPage = 0;
    this.updatePaginatedItems();
  }

  matchesSearchTerm(item: Item): boolean {
    if (!this.searchTerm) return true;

    const searchLower = this.searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.artist?.name?.toLowerCase().includes(searchLower) ||
      item.genre?.toLowerCase().includes(searchLower) ||
      item.category?.name?.toLowerCase().includes(searchLower) ||
      item.releaseYear?.toString().includes(searchLower)
    );
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'Todas Categorias';
    this.selectedArtist = this.artistsFilterOptions[0]; // "Todos Artistas"
    this.applyFilters();
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.itemsPerPage = event.rows;
    this.updatePaginatedItems();
  }

  updatePaginatedItems() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedItems = this.filteredItems.slice(start, end);
  }

  openItemDetails(item: Item) {
    this.selectedItemDetails = item;
    this.displayDetails = true;
  }

  getCoverFromAlbum(event) {
    console.log('Selected item:', event.data);
    if (event.data.coverImagePath) {
      // Usar a URL do S3 diretamente
      this.display = true;
      this.retrievedImage = event.data.coverImagePath;
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Este item não possui imagem de capa.',
        life: 3000
      });
    }
  }

  delete(item: Item): void {
    if (!item || (!item.id && !item._id)) {
      console.error('Invalid item or item ID:', item);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'ID do item inválido'
      });
      return;
    }

    console.log('Deleting item:', item);
    this.confirmationService.confirm({
      message: `Deseja realmente remover o álbum "${item.title}" do artista "${item.artist?.name}"?`,
      accept: () => {
        const itemId = item.id || item._id;
        this.itemService.delete(itemId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Álbum deletado com sucesso.'
            });
            this.list();
          },
          error: (error) => {
            console.error('Error deleting item:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao deletar álbum. Por favor, tente novamente.'
            });
          }
        });
      }
    });
  }

  onRowSelect(event) {
    this.messageService.add({severity:'info', summary:'Album selecionado', detail: event.data.name + ' - ' + event.data.country});
  }

  closeDialog() {
    this.retrievedImage = null;
  }

  onImageError(event: any) {
    if (this.display) { // Só mostra o erro se o diálogo estiver aberto
      console.error('Error loading image:', event);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar imagem. Verifique as permissões do bucket S3.',
        life: 5000
      });
      this.display = false;
    }
  }

  onImageLoad(event: any) {
    console.log('Image loaded successfully:', event);
  }

  /**
   * Retorna a URL da imagem de capa do item.
   * Prioriza discogsImageUrl, depois coverImagePath.
   */
  getItemCoverImage(item: Item): string {
    return item.discogsImageUrl || item.coverImagePath || 'assets/placeholder-album.png';
  }

}
