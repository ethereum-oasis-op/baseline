import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @HostBinding('class') componentClass = 'ub-card';
  @Input() title: string;
}
