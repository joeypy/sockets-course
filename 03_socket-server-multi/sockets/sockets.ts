import { Socket } from "socket.io";
import socketIO from "socket.io";
import { UsuariosLista } from "../classes/usuario-lista";
import { Usuario } from "../classes/usuario";
import { Mapa } from '../classes/mapa';
import { Marcador } from '../classes/marcador';

export const usuariosConectados = new UsuariosLista();
export const mapa = new Mapa();

// Escuchar conexión de clientes
export const conectarCliente = (cliente: Socket, io: socketIO.Server) => {
  console.log("Cliente conectado");
  const usuario = new Usuario(cliente.id);
  usuariosConectados.agregar(usuario);
};

// Escuchar desconexión de clientes
export const desconectar = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("disconnect", () => {
    console.log("Cliente desconectado");
    usuariosConectados.borrarUsuario(cliente.id);
    io.emit("usuarios-activos", usuariosConectados.getLista());
  });
};

// Escuchar mensajes de clientes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("mensaje", (payload: { de: string; cuerpo: string }) => {
    console.log("Mensaje recibido: ", payload);
    io.emit("mensaje-nuevo", payload);
  });
};

export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {
  cliente.on(
    "configurar-usuario",
    (payload: { nombre: string }, callback: Function) => {
      usuariosConectados.actualizarNombre(cliente.id, payload.nombre);
      io.emit("usuarios-activos", usuariosConectados.getLista());

      callback({
        ok: true,
        mensaje: `Usuario ${payload.nombre}, configurado`,
      });
    }
  );
};

export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
  cliente.on("obtener-usuarios", () => {
    io.to(cliente.id).emit("usuarios-activos", usuariosConectados.getLista());
  });
};


// ######################################################################################
//  Eventos de mapas
// ######################################################################################

export const mapaSockets = ( cliente: Socket, io: socketIO.Server) => {
  cliente.on('marcador-nuevo', (marcador: Marcador) => {
    mapa.agregarMarcador(marcador);
    cliente.broadcast.emit('marcador-nuevo', marcador );
  })
  cliente.on('borrar-marcador', (id: string) => {
    mapa.borrarMarcadores(id);
    console.log("usuario eliminado: ", id, mapa.getMarcadores());
    cliente.broadcast.emit('borrar-marcador', id );
  })
  cliente.on('marcador-mover', (marcador: Marcador) => {
    mapa.moverMarcador(marcador);
    cliente.broadcast.emit('marcador-mover', marcador );
  })
}