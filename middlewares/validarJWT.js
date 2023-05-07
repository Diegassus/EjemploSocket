const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');



const validarJWT  = async ( req=request, res=response, next )=>{

    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({
            msg: 'Acceso no autorizado'
        });
    }

    try{
        const {uid} = jwt.verify( token, process.env.SECRET );
        
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido'
            });
        }


        req.usuario=usuario
        
        req.uid = uid ;

        next();
    }catch(e){
        console.log(e);
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }    
}

module.exports ={
    validarJWT
}