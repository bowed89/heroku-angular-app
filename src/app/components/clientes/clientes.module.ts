import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ListadoClienteComponent } from './listado-cliente/listado-cliente.component';
import { clientesRoutingModule } from './clientes-routing.module';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ListadoClienteComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    clientesRoutingModule,
    SharedModule
  ]
})
export class ClientesModule { }
