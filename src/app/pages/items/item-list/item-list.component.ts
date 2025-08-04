import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { ArtistItemDetailsResponse } from '../../artists/model/ArtistItemDetailsResponse';
import { ArtistService } from '../../artists/services/artist.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Item } from '../model/item';
import { ItemService, ItemWithCoverImage } from '../services/item.service';

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
  menuItems: MenuItem[];

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
    // Usar o endpoint que retorna os itens completos
    this.itemService.listAll().subscribe({
      next: (items) => {
        console.log('Items loaded:', items);
        this.items = items;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar lista de álbuns.',
          life: 3000
        });
      }
    });
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

}
