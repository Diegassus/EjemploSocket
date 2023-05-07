const { response, json } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/googleVerify");



const login = async (req,res=response)=>{

    const {correo,password} = req.body

    try{

        // verificar si existe el correo
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Correo o password invalido - Correo'
            });
        }

        // actiivdad de usuario
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Correo o password invalido - estado falso'
            });
        }

        //validar password
        const passValid = bcryptjs.compareSync(password,usuario.password);
        if(!passValid){
            return res.status(400).json({
                msg:'Correo o password invalido - password'
            });
        }

        // generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    }catch(e){
        return res.status(500).json({
            msg:"Algo salio mal",
            e
        });
    }
}

const googleSignIn = async (req,res=response)=>{

    const {id_token} = req.body

    try{

        const {correo,nombre,img} = await googleVerify(id_token)
        let usuario = await Usuario.findOne({correo});
        if(!usuario){
            //crear usuario
            const data = {
                nombre,
                correo,
                password:'a',
                role:'USER_ROLE',
                img,
                google:true
            }

            usuario = new Usuario(data);
            await usuario.save()
        }

        if(!usuario.estado){
            res.status(401).json({
            msg:'Usuario bloqueado'
        })
        }

        const token = await generarJWT(usuario.id);

        res.json({
                msg:'todo ok',
                token,
                usuario
            })
    }catch(e){
        res.status(400).json({
            msg:'no se pudo verificar el token de google'
        })
    }
}

const renovarToken = async (req, res= response)=>{

    const { usuario } = req ;

    // generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
        usuario,
        token
    })
}


module.exports = {
    login,
    googleSignIn,
    renovarToken
}