import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoOrdenesComponent } from './listado-ordenes/listado-ordenes.component';

const routes: Routes = [
    { path: 'listado', component:  ListadoOrdenesComponent},
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class clientesRoutingModule { }
  