import { Component, OnInit } from '@angular/core';
import { WebsocketsService } from '../../services/websockets.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  nombre = '';
  constructor(public wsService: WebsocketsService) { }

  ngOnInit(): void {
  }
  ingresar() {
    this.wsService.loginWS( this.nombre );
    this.nombre = '';
  }

}
