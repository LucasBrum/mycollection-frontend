import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiscogsService } from '../services/discogs.service';
import { DiscogsSearchResult, DiscogsRelease } from '../model/discogs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-discogs-search-dialog',
  templateUrl: './discogs-search-dialog.component.html',
  styleUrls: ['./discogs-search-dialog.component.scss']
})
export class DiscogsSearchDialogComponent {

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() releaseSelected = new EventEmitter<DiscogsRelease>();

  searchQuery: string = '';
  searchType: string = 'album';
  searchResults: DiscogsSearchResult[] = [];
  selectedResult: DiscogsSearchResult | null = null;
  releaseDetails: DiscogsRelease | null = null;

  loading: boolean = false;
  loadingDetails: boolean = false;

  // Pagination
  currentPage: number = 1;
  totalRecords: number = 0;
  rowsPerPage: number = 10;

  searchTypeOptions = [
    { label: 'Album', value: 'album' },
    { label: 'Artista', value: 'artist' }
  ];

  constructor(
    private discogsService: DiscogsService,
    private messageService: MessageService
  ) {}

  search(): void {
    if (!this.searchQuery.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Digite um termo para buscar'
      });
      return;
    }

    this.loading = true;
    this.searchResults = [];
    this.selectedResult = null;
    this.releaseDetails = null;

    const searchObservable = this.searchType === 'artist'
      ? this.discogsService.searchByArtist(this.searchQuery, this.currentPage, this.rowsPerPage)
      : this.discogsService.searchByAlbum(this.searchQuery, this.currentPage, this.rowsPerPage);

    searchObservable.subscribe({
      next: (response) => {
        this.searchResults = response.results || [];
        this.totalRecords = response.pagination?.items || 0;
        this.loading = false;

        if (this.searchResults.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Nenhum resultado encontrado'
          });
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar no Discogs. Verifique sua conexão.'
        });
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.rowsPerPage = event.rows;
    this.search();
  }

  selectResult(result: DiscogsSearchResult): void {
    this.selectedResult = result;
    this.loadingDetails = true;
    this.releaseDetails = null;

    this.discogsService.getReleaseDetails(result.id).subscribe({
      next: (release) => {
        this.releaseDetails = release;
        this.loadingDetails = false;
      },
      error: (error) => {
        console.error('Error loading release details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar detalhes do release'
        });
        this.loadingDetails = false;
      }
    });
  }

  confirmSelection(): void {
    if (this.releaseDetails) {
      this.releaseSelected.emit(this.releaseDetails);
      this.closeDialog();
    }
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetState();
  }

  private resetState(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedResult = null;
    this.releaseDetails = null;
    this.currentPage = 1;
    this.totalRecords = 0;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  /**
   * Retorna a URL da imagem de capa (thumbnail ou cover)
   */
  getCoverImage(result: DiscogsSearchResult): string {
    return result.thumb || result.coverImage || 'assets/placeholder-album.png';
  }

  /**
   * Retorna a URL da imagem em alta resolução do release
   */
  getReleaseImage(): string {
    if (this.releaseDetails?.images && this.releaseDetails.images.length > 0) {
      // Prioriza imagem primária
      const primaryImage = this.releaseDetails.images.find(img => img.type === 'primary');
      return primaryImage?.uri || this.releaseDetails.images[0].uri;
    }
    return this.selectedResult?.coverImage || 'assets/placeholder-album.png';
  }

  /**
   * Formata o nome do artista (remove sufixo do Discogs como "(2)")
   */
  getArtistName(): string {
    if (this.releaseDetails?.artists && this.releaseDetails.artists.length > 0) {
      return this.releaseDetails.artists[0].name.replace(/\s*\(\d+\)$/, '');
    }
    return 'Artista Desconhecido';
  }

  /**
   * Retorna o nome da gravadora
   */
  getLabelName(): string {
    if (this.releaseDetails?.labels && this.releaseDetails.labels.length > 0) {
      return this.releaseDetails.labels[0].name;
    }
    return 'N/A';
  }

}
