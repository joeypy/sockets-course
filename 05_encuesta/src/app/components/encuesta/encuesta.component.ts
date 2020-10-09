import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {

  // Configuraciones de la gráfica
    public barChartOptions: any = {
      scaleShowVerticalLines: false,
      responsive: true
      };
  public barChartLabels: string[] = ['Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4'];
  public barChartType = 'bar';
  public barChartData: any[] = [
    { data: [0, 0, 0, 0], label: 'Preguntas' }
  ];
  public lineChartColors: Color[] = [
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
    },
  ];


  constructor( private http: HttpClient,
               public wsService: WebsocketService) {}

    ngOnInit() {
      this.http.get('http://localhost:5000/encuesta')
        .subscribe( (data: any) => { this.barChartData = data; });
      this.escucharSocket();
    }


    escucharSocket() {
      this.wsService.listen('cambio-encuesta')
        .subscribe( (data: any) => { this.barChartData = data; });
    }

}
