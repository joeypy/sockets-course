import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {

  public socketStatus = false;

  constructor(private socket: Socket) {
    this.checkStatus();
  }

  // Muestra el estado del servidor
  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado al servidor');
      this.socketStatus = false;
    });
  }

  // Emite un evento
  emit( evento: string, payload?: any, callback?: Function) {
    console.log('Emitiendo', evento);
    this.socket.emit( evento, payload, callback );
  }

  listen( evento: string ) {
    return this.socket.fromEvent( evento );
  }

}
