import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoClienteComponent } from './listado-cliente/listado-cliente.component';

const routes: Routes = [
    { path: 'listado', component:  ListadoClienteComponent},
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class clientesRoutingModule { }
  