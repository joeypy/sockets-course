import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketsService } from '../../services/websockets.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nombre = '';
  constructor(public wsService: WebsocketsService,
              private router: Router) { }

  ngOnInit(): void {
  }


  ingresar() {
    if (this.nombre.trim() === '') {
      return;
    };
    this.wsService.loginWS( this.nombre )
      .then( () => {
        this.router.navigateByUrl('/mensajes');
      });
    this.nombre = '';
  }

}
