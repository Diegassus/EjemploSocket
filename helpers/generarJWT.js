const jwt = require('jsonwebtoken');
const { Usuario } = require('../models')

const generarJWT = ( uid = '' )=>{
    return new Promise((res,rej)=>{

        const payload = { uid }

        jwt.sign(payload, process.env.SECRET,{
            expiresIn:'4h'
        },(err,token)=>{
            if(err){
                console.log(err);
                rej('No se pudo generar el token');
            }else{
                res(token);
            }
        })

    })
}

const comprobarJWT = async ( token='')=>{
    try{
        if(token.length === 0){
            return null
        }

        const {uid} = jwt.verify(token , process.env.SECRET)
        const usuario = await Usuario.findById(uid);
        
        if(usuario){
            if(usuario.estado){
                return usuario
            }
        }

        return null
    }catch(e){
        return null
    }
}


module.exports= {
    generarJWT,
    comprobarJWT
}