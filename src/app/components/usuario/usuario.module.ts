import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { UsuarioRoutingModule } from './usuario-routing.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    UsuarioRoutingModule
  ]
})
export class OrdenesModule { }
