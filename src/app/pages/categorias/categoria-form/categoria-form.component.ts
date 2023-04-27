import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Category } from '../model/category';

import { CategoriaService } from '../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss'],
  providers: [MessageService]
})
export class CategoriaFormComponent implements OnInit {

  // Chamar um método de outro componente
  //@ViewChild('categoriaGrid') categoriaGrid: CategoriasComponent;

  id: number;

  category: Category;

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

  setCategoryFormToEdit(category: Category) {
    this.category = category;

    if(category) {
      this.categoriaForm.patchValue({
        id: category._id,
        name: category.name
      });
    }
  }

  buildForm() {
    this.categoriaForm = this.formBuilder.group({
      name: ['', Validators.required]
    })
  }

  salvar() {
    this.categoriaService.save(this.categoriaForm.value)
    .subscribe(result => {

        this.messageService.add({
          severity:'success',
          summary:'Sucesso',
          detail:'Categoria criada com sucesso.'
        });
      },
      error => {this.onError('Erro ao cadastrar Categoria.')}
      )
      this.displayModal = false;
      this.categoriaForm.reset();

  }

  private updateCateogory() {
    this.categoriaService.update(this.category['id'], this.categoriaForm.value)
      .subscribe(result => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Categoria atualizada com sucesso.'
        });
      },
        error => { this.onError('Erro ao atualizar categoria.')}
      );

      this.categoriaForm.reset();
  }

  showModalDialog() {
    this.displayModal = true;
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

  get camposForm(): any { return this.categoriaForm.controls; }

  get name(): string { return this.camposForm.name.value; }

}
