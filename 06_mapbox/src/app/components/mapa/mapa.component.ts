import { Component, OnInit } from '@angular/core';
import { Lugar } from '../../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';

import * as mapboxgl from 'mapbox-gl'; 
import { WebsocketService } from '../../services/websocket.service';
import { Marcador } from '../../../../../03_socket-server-multi/classes/marcador';

interface RespMarcadores {
  [key: string ]: Lugar
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  mapa: mapboxgl.Map;
  lugares: RespMarcadores = {};
  markeerMapBox: { [id: string]: mapboxgl.Marker } = {};


  constructor(private http: HttpClient,
              private wsService: WebsocketService) { }

  ngOnInit(): void {
    this.http.get<RespMarcadores>("http://localhost:5000/mapa")
      .subscribe( lugares => {
        this.lugares = lugares;
        this.crearMapa();
      });
    this.escucharSocket();
  }

  escucharSocket(){
    // marcador-nuevo
    this.wsService.listen('marcador-nuevo')
      .subscribe( (marcador: Lugar) => {
        this.agregarMarcador(marcador);
      })

    // marcador-mover
    this.wsService.listen('marcador-mover')
      .subscribe( (marcador: Lugar) => {
        this.markeerMapBox[ marcador.id ].setLngLat([marcador.lng, marcador.lat]);
      });
    
    // marcador-borrar
    this.wsService.listen('borrar-marcador')
      .subscribe( (id: string) => {
        this.markeerMapBox[ id ].remove();
        delete this.markeerMapBox[id];
      })
  }


  crearMapa() {
    (mapboxgl as any).accessToken = 'pk.eyJ1Ijoiam9leXB5IiwiYSI6ImNrZzJ0ZmdzazA0NWoyeG5ucjBlZ3dvYTYifQ.zh83vk4OaV0rWXH9OwFXsw';
    this.mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-75.75512993582937 , 45.349977429009954],
      zoom: 15.8
    });

    for( const [id, marcador] of Object.entries(this.lugares) ) {
      this.agregarMarcador( marcador );
    }
  }


  agregarMarcador( marcador: Lugar ) {

    // Elemento HTML del PopUp
    const h2 = document.createElement('h2');
    h2.innerText = marcador.nombre;
    const btnBorrar = document.createElement('button');
    btnBorrar.innerText = 'Borrar'
    const div = document.createElement('div');
    div.append(h2, btnBorrar);

    // Configuración del marcador
    const customPopUp = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setDOMContent( div );

    // Creación del marcador
    const marker = new mapboxgl.Marker({
      draggable: true,
      color: marcador.color
    })
    .setLngLat([marcador.lng, marcador.lat])
    .setPopup(customPopUp)
    .addTo( this.mapa );

    // Drag del marcador
    marker.on('drag', ()=> {
      const lngLat = marker.getLngLat();
      const nuevoMarcador = {
        id: marcador.id,
        ...lngLat
      }
      this.wsService.emit('marcador-mover', nuevoMarcador );
    });

    // Borrar marcador
    btnBorrar.addEventListener('click', () => {
      marker.remove();
      this.wsService.emit('borrar-marcador', marcador.id);
   });

   this.markeerMapBox[ marcador.id ] = marker;
  }

  crearMarcador() {
    const customMarker: Lugar = {
      id: new Date().toISOString(),
      lng: -75.75512993582937,
      lat: 45.349977429009954,
      nombre: 'Sin nombre',
      color: '#' + Math.floor(Math.random()*16777215).toString(16) 
    }
    this.agregarMarcador( customMarker );
    // emitir marcador nuevo
    this.wsService.emit( 'marcador-nuevo', customMarker );
  }
}
