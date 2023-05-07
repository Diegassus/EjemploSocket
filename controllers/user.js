const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');



const usersGet = async (req,res = response)=>{

    const {limite = 5 , desde=0} = req.query

    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true}).skip(Number(desde)).limit(Number(limite))
    ])

    res.json({total,usuarios});

}

const usersPost = async (req,res=response)=>{

    const {nombre,correo,password,role} = req.body;
    const usuario = new Usuario({nombre,correo,password,role});

    // hashear password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);

    // guadar en db
    await usuario.save();

    res.json({
        msg:'post api',
        usuario
    });
}

const userPut = async (req,res = response)=>{

    const {id} = req.params
    const {_id,password,google,correo,...data} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        data.password = bcryptjs.hashSync( password , salt );
    }

    const usuario = await Usuario.findByIdAndUpdate(id,data)

    res.json({usuario});
}

const usersDelete = async (req,res=response)=>{
    const {id}= req.params
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});

    res.json({
        usuario
    });
}

module.exports={
    usersGet,
    usersPost,
    userPut,
    usersDelete
}