import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { CategoriaService } from '../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss'],
  providers: [MessageService]
})
export class CategoriaFormComponent implements OnInit {

  categoriaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriaService: CategoriaService) {
    this.categoriaForm = this.formBuilder.group({
      name: [null]
    })
   }

  ngOnInit(): void {
  }

  salvar() {
    this.categoriaService.save(this.categoriaForm.value).subscribe(
      result => {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Categoria criada com sucesso.'})
      },
      error => {this.onError()}
    )
  }

  private onError() {
    const msg = 'Erro ao cadastrar Categoria.';
    this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao criar Categoria.', life:5000})
  }

}
