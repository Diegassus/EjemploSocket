const { response } = require("express");
const { subirArchivo } = require("../helpers/subirArchivo");
const { Usuario, Producto } = require("../models");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL)

const actualizarArchivosCloudinary = async (req,res=response)=>{
    const {id,coleccion} = req.params
    let modelo ;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:'no existe el usuario'
                })
            }
            
            break;
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg:'no existe el producto'
                    })
                }

            break;
    
        default:
            return res.status(500).json('Colecciones no validadas')
            break;
    }

    if(modelo.imagen){
        const nombreArr = modelo.imagen.split('/');
        const nombre = nombreArr[nombreArr.length-1];
        const [public_id ] = nombre.split('.')
        cloudinary.uploader.destroy(public_id)
     }
     const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.imagen= secure_url

    await modelo.save();
    
    res.json({
        modelo
    })
}

const cargarArchvos = async (req,res=response)=>{

    try{
        const path = await subirArchivo(req.files);
        res.json({
            path
        })
        
    }catch(e){
        res.status(400).json({
            msg:e
        })
    }

   
}

const actualizarArchivos = async (req,res=response)=>{
    const {id,coleccion} = req.params
    let modelo ;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:'no existe el usuario'
                })
            }
            
            break;
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg:'no existe el producto'
                    })
                }

            break;
    
        default:
            return res.status(500).json('Colecciones no validadas')
            break;
    }

    if(modelo.imagen){
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.imagen);
        if(fs.existsSync(pathImagen)){
         fs.unlinkSync(pathImagen)
        }
     }

    modelo.imagen = await subirArchivo(req.files,undefined,coleccion);

    modelo.save()

    res.json({
        modelo
    })
}

const mostrarImagen = async (req,res=response)=>{

    const {id,coleccion} = req.params
    let modelo ;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg:'no existe el usuario'
                })
            }
            
            break;
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg:'no existe el producto'
                    })
                }

            break;
    
        default:
            return res.status(500).json('Colecciones no validadas')
    }

    if(modelo.imagen){
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.imagen);
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }
    const pathNoImage = path.join(__dirname,'../public/assets/no-image.jpg')
    res.sendFile( pathNoImage );
}


module.exports ={
    cargarArchvos,
    actualizarArchivosCloudinary,
    mostrarImagen
}