import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { EncuestaComponent } from './components/encuesta/encuesta.component';

const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    EncuestaComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
