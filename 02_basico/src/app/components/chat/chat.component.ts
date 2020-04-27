import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketsService } from 'src/app/services/websockets.service';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  msg = '';
  mensajeSuscription: Subscription;
  elemento: HTMLElement;

  mensajes: any[] = [];

  constructor(public wsService: WebsocketsService,
              public chatService: ChatService) { }

  ngOnInit() {
    this.elemento = document.getElementById('chat-mensajes');
    this.mensajeSuscription = this.chatService.getMessages().subscribe( (msg) => {
      this.mensajes.push( msg );
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 50);
    });
  }
  ngOnDestroy() {
    this.mensajeSuscription.unsubscribe();
  }

  enviarMsg(){
    if (this.msg.trim().length === 0){
      return;
    }
    this.chatService.sendMessages( this.msg );
    this.msg = '';
  }

}
