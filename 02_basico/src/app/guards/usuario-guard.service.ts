import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WebsocketsService } from '../services/websockets.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {

  constructor(public wsService: WebsocketsService,
              private router: Router) { }

  canActivate() {
    if ( this.wsService.getUsuario() ) {
      return true;
    } else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
