const  validarCampos  = require("../middlewares/validarCampos");
const  validarJWT  = require("../middlewares/validarJWT");
const  validaRoles = require("../middlewares/validarRoles");
const validarArchivo = require('../middlewares/validarArchivo')


module.exports={
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}