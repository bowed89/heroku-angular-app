import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ListadoProductosComponent } from './listado-productos/listado-productos.component';
import { clientesRoutingModule } from './productos-routing.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ListadoProductosComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    clientesRoutingModule,
    SharedModule
  ]
})
export class ProductosModule { }
