import { Component, Input, OnInit } from '@angular/core';
import { BtnComponent } from '../btn/btn.component';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [BtnComponent, RouterLink, NgIf],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {

  @Input() data: any;
  constructor() {
  }

  ngOnInit(): void {
    console.log('datos para card', this.data)
  }
}
