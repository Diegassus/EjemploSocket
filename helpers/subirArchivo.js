const { v4 : uuidv4 } = require('uuid')

const path = require('path')


const subirArchivo = (files, validas =  ['png','jpg','jpeg','gif'], carpeta = "" )=>{

    return new Promise((res,rej)=>{
        const {archivo} = files
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length -1]

        if(!validas.includes(extension)){
            return rej ('La extension no es valida')
        }

        const nombreTemporal = uuidv4() + '.' + extension

        const uploadPath = path.join(__dirname ,'../uploads/',carpeta, nombreTemporal) ;

        archivo.mv(uploadPath,(err)=>{
            if(err) return rej(err);
        });

        res(nombreTemporal)
    })
    
}

module.exports={
    subirArchivo
}