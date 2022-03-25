import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public auth: UsuarioService, 
    public router: Router
    ) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/pages/login']);
      return false;
    }
    return true;
  }
}