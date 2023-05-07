const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchvos, mostrarImagen, actualizarArchivosCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers/dbValidators");
const { validarArchivo } = require("../middlewares");
const { validarCampos } = require("../middlewares/validarCampos");

const router = Router();


router.post('/',[
    validarArchivo
],cargarArchvos);

router.put('/:coleccion/:id', [
    check('id','debe ser de mongo el id').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarArchivo,
    validarCampos
],actualizarArchivosCloudinary)

router.get('/:coleccion/:id',[
    check('id','debe ser de mongo el id').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImagen)


module.exports = router ;