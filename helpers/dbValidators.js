const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(role='')=>{
    const existeRole = await Role.findOne({role})
    if(!existeRole){
        throw new Error('El rol no esta registrado en la BD');
    }
}

const esEmailValido = async (correo)=>{
    // verificar si existe el correo
    const emailExiste = await Usuario.findOne({correo});
    if(emailExiste){
        throw new Error("El correo ya esta registrado");
    }
}

const esIdValido = async (id)=>{
    // verificar si existe el correo
    const usuarioExiste = await Usuario.findById(id);
    if(!usuarioExiste){
        throw new Error("El id no existe");
    }
}

const esCatValido = async (id)=>{
    const categoriaExiste = await Categoria.findById(id);
    if(!categoriaExiste){
        throw new Error("El id no existe")
    }
}

const esProdValido = async (id)=>{
    const productoExiste = await Producto.findById(id);
    if(!productoExiste){
        throw new Error("El id no existe")
    }
}

const coleccionesPermitidas = (coleccion , permitidas)=>{
    if(!permitidas.includes(coleccion)){
        throw new Error('La coleccion no esta permitida') 
    }

    return true
}

module.exports ={
    esRolValido,
    esEmailValido,
    esIdValido,
    esCatValido,
    esProdValido,
    coleccionesPermitidas
}