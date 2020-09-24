import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from "../classes/usuario-lista";
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuariosLista();


// Escuchar conexión de clientes
export const conectarCliente = ( cliente: Socket ) => { 
    console.log("Cliente conectado");
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );
}


// Escuchar desconexión de clientes
export const desconectar = ( cliente: Socket ) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario( cliente.id );
        console.log('Cliente desconectado');
    })
}


// Escuchar mensajes de clientes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {
        console.log('Mensaje recibido: ', payload);
        io.emit('mensaje-nuevo', payload);
    })
}


export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('configurar-usuario', ( payload: { nombre: string }, callback: Function ) => {
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
    });
}