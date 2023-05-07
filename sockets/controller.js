const { comprobarJWT } = require("../helpers/generarJWT");

const {ChatMensajes} = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async (socket , io)=>{

    const token = socket.handshake.headers['authorization'] ;
    const usuario = await comprobarJWT(token);

    if(!usuario){
        return socket.disconnect();
    }

    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes',chatMensajes.ultimos10)

    // conectar a sala especial
    socket.join(usuario.id)

    // limpiar desconexion de usuario
    socket.on('disconnect', ()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje',({uid , mensaje})=>{
        if(uid){
            socket.to(uid).emit('mensaje-privado',{de:usuario.nombre,mensaje})
        }else{
            chatMensajes.enviarMensaje(usuario.id , usuario.nombre , mensaje);
            io.emit('recibir-mensajes',chatMensajes.ultimos10)
        }
    })
}

module.exports = {
    socketController
}