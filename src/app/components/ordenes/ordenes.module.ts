import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ListadoOrdenesComponent } from './listado-ordenes/listado-ordenes.component';
import { clientesRoutingModule } from './ordenes-routing.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ListadoOrdenesComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    clientesRoutingModule,
    SharedModule
  ]
})
export class OrdenesModule { }
