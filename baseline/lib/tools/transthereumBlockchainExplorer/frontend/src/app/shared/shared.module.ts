import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CardComponent, NotFoundComponent],
  imports: [CommonModule, RouterModule],
  exports: [CardComponent]
})
export class SharedModule { }
