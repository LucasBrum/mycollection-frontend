import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CategoriasComponent } from '../categorias/categorias.component';

import { CategoriaService } from '../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss'],
  providers: [MessageService]
})
export class CategoriaFormComponent implements OnInit {

  @ViewChild('categoriaGrid') categoriaGrid: CategoriasComponent;

  categoriaForm: FormGroup;
  isEditing: boolean;
  displayModal: boolean;
  pristine = true;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriaService: CategoriaService) {


   }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.categoriaForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  salvar() {
    this.categoriaService.save(this.categoriaForm.value).subscribe(
      result => {
        
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Categoria criada com sucesso.'});
        this.categoriaGrid.list();
        this.categoriaForm.reset();
      },
      error => {this.onError()}
      )
      this.displayModal = false;
      
  }

  showModalDialog() {
    this.displayModal = true;
  }

  private onError() {
    const msg = 'Erro ao cadastrar Categoria.';
    this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao criar Categoria.', life:5000})
  }

  get camposForm(): any { return this.categoriaForm.controls; }

  get name(): string { return this.camposForm.name.value; }

}
