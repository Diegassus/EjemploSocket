const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const {Usuario, Categoria, Producto }= require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos'
]

const buscarProductos = async (termino = '' , res=response)=>{
    const mongoID = ObjectId.isValid(termino);

    if(mongoID){
        const producto = await Producto.findById(termino).populate('categoria','nombre')
        return res.json({
            results : (producto) ? [producto] : []
        })
    }
    // para buscarlos x catgoria es con {categoria:ObjectId('mongoId')}
    const regex = new RegExp(termino,'i');

    const productos = await Producto.find({nombre:regex,estado:true}.populate('categoria','nombre'));

    return res.json({
        results : (productos) ? [productos] : []
    })
}

const buscarCategorias = async (termino='',res=response)=>{
    const mongoID = ObjectId.isValid(termino);

    if(mongoID){
        const categoria = await Categoria.findById(termino)
        return res.json({
            results : (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino,'i');

    const categorias = await Categoria.find({nombre:regex,estado:true});

    return res.json({
        results : (categorias) ? [categorias] : []
    })
}

const buscarUsuario = async (termino = '' , res=response)=>{

    const mongoID = ObjectId.isValid(termino);

    if(mongoID){
        const usuario = await Usuario.findById(termino)
        return res.json({
            results : (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino,'i');

    const usuarios = await Usuario.find({
        $or : [{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    });

    return res.json({
        results : (usuarios) ? [usuarios] : []
    })

}


const buscar = (req,res=response)=>{
    const {coleccion,termino} = req.params

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch(coleccion){
        case 'usuarios':
            buscarUsuario(termino,res)
        break;
        case 'categorias':
            buscarCategorias(termino,res)
        break;
        case 'productos':
            buscarProductos(termino,res)
        break;
        default:
            res.status(500).json({
                msg:'Busqueda mal hecha'
            })
    }

}

module.exports = {
    buscar
}