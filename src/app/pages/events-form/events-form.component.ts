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
  ) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      ticket_price: ['', [Validators.required]],
      discount: [false, [Validators.required]],
      percentage: ['', []],
      image: ['', [Validators.required]],
      date: ['', [Validators.required]],
      location: ['', [Validators.required]],
      ticket_quantity: ['', [Validators.required]],
      tags: ['', [Validators.required]]
    });

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.action = this.activatedRoute.snapshot.paramMap.get('action') || 'create';

    if (this.action !== 'create') {
      this.db.getDocumentById('eventos', this.id)
        .subscribe((res: any) => {
          if (res) {
            this.data = res;
            const { name, description, ticket_price, discount, percentage, image, date, location, ticket_quantity, tags } = this.data;
            this.eventForm.patchValue({
              name: name || '',
              description: description || '',
              ticket_price: ticket_price || '',
              discount: discount || false,
              percentage: percentage || '',
              image: image || '',
              date: date || '',
              location: location || '',
              ticket_quantity: ticket_quantity || '',
              tags: tags ? tags.join(', ') : ''
            });
          }
        });
    }
  }

  crud() {
    if (this.eventForm.valid) {
      const formData = { ...this.eventForm.value, 
        tags: this.eventForm.value.tags.split(',').map((tag: string) => tag.trim())
      };

      if (this.action === 'create') {
        this.db.addFirestoreDocument('eventos', formData);
        alert('Evento creado');
      }
      if (this.action === 'update') {
        this.db.updateFirestoreDocument('eventos', this.id, formData);
        alert('Datos actualizados');
      }
      if (this.action === 'delete') {
        this.db.deleteFirestoreDocument('eventos', this.id);
        alert('Evento eliminado');
      }
    } else {
      alert('Datos inválidos');
    }
  }
}