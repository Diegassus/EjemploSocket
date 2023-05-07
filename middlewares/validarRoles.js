const { response } = require("express")




const esAdmin = (req,res=response,next)=>{

    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere validar el usuario sin un token validado'
        });
    }

    const {role,nombre} = req.usuario;

    if(role!="ADMIN_ROLE"){
        return res.status(401).json({
            msg:'El usuario no es administrador'
        });
    }

    next();
}



const tieneRol = ( ...roles )=>{
    return (req,res=response,next)=>{

        if(!req.usuario){
            return res.status(500).json({
                msg:'Se quiere validar el usuario sin un token validado'
            });
        }

        if(!roles.includes(req.usuario.role)){
            return res.status(401).json({
                msg:'El usuario no tiene un rol valido'
            });
        }

        next();
    }

}


module.exports={
    esAdmin,
    tieneRol
}