import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './events-form.component.html',
  styleUrl: './events-form.component.scss'
})
export class EventsFormComponent {
  action: any;
  id: any;
  data: any;
  eventForm: FormGroup;
  constructor(
    public db: DatabaseService,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ){
    this.eventForm = this.fb.group({
      title: ['',[Validators.required]],
      description: ['',[Validators.required]],
      price: ['',[Validators.required]],
      discount:['',[Validators.required]],
      highlight: ['',[Validators.required]],
      image:['',[Validators.required]]
    });

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('jueputaid', this.id)
    if (this.activatedRoute.snapshot.paramMap.get('action')){
      this.action = this.activatedRoute.snapshot.paramMap.get('action')
    }
    else{
      this.action = 'create';
    }
    
    if (this.action !== 'create'){
      this.db.getDocumentById('eventos', this.id)
      .subscribe((res:any)=>{
        console.log('evento seleccionado', res);
        if(res){
          this.data = res;
          const {title, description, price, discount, highlight, image} = this.data;
          this.eventForm.setValue({
            title: title,
            description: description,
            price: price,
            discount: discount,
            highlight: highlight,
            image: image
          })
        }
      });
    }
  }
  crud(){
    if(this.eventForm.valid){
      if(this.action === 'create'){
        this.db.addFirestoreDocument('eventos',this.eventForm.value);
        alert('Evento creado');
      }
      if(this.action === 'update'){
        this.db.updateFirestoreDocument('eventos', this.id, this.eventForm.value);
        alert('Datos actualizados');
      }
      if(this.action === 'delete'){
        this.db.deleteFirestoreDocument('eventos', this.id);
        alert('Evento eliminado');
      }
    }
    else{
      alert('Datos inválidos');
    }
  }
}
