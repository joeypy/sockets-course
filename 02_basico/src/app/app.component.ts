import { Component, OnInit } from '@angular/core';
import { WebsocketsService } from './services/websockets.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  constructor(public wsService: WebsocketsService,
              public chatService: ChatService) {}

  ngOnInit(){
    this.chatService.getMenssagesprivate().subscribe( msg => {
      console.log('Mensaje de rest: ', msg);
    });
  }
}
