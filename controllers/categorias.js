const { response } = require("express");
const {Categoria} = require("../models/");

// obtenerCategorias - paginado total - populate
const obtenerCategorias = async (req,res=response)=>{
    const {limite = 5 , desde=0} = req.query

    const [total,usuarios] = await Promise.all([
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true})
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario')
        .exec()
    ]);

  res.json({
    total,
    usuarios
  })
}

// obtener categoria - populate {}
const obtenerCategoria = async (req,res=response)=>{
    const {id} = req.params;
    await Categoria.findById(id)
    .populate('usuario')
    .exec(function (err, cat) {
        if (err) return console.log(err);
        res.json({
            cat
        })
    });
}

// crear categoria 
const crearCategoria = async (req,res=response)=>{
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    // generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria(data);
    
    // guardar en db
    await categoria.save();

    res.status(201).json({
        categoria
    })
}

// actualizarCategoria - validar
const actualizarCategoria = async (req,res=response)=>{
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const nombreExiste = await Categoria.findOne({nombre});
    if(nombreExiste){
        return res.status(400).json({
            msg:"Ya existe una categoria con ese nombre"
        });
    }

    const categoria = await Categoria.findByIdAndUpdate(id,{nombre:nombre});

    res.json({categoria})

}

// borrarCategoria - validar
const borrarCategoria = async (req,res=response )=>{
    const {id} = req.params
    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false});

    res.json({
        categoria
    })


}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}