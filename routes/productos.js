const {Router} = require('express');
const {check} = require('express-validator');
const { obtenerProductos, obtenerProducto, publicarProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { esProdValido } = require('../helpers/dbValidators');
const { validarCampos, esAdmin, validarJWT, tieneRol } = require('../middlewares');

const router = Router()


// obtener todos los productos - publico
router.get('/',obtenerProductos);

// obtener un producto  - publico
router.get('/:id',[
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(esProdValido),
    validarCampos
],obtenerProducto);

// publicar un producto  - privado
router.post('/',[
    validarJWT,
    tieneRol("ADMIN_ROLE","VENTAS_ROLE"),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],publicarProducto);

// actualizar un producto - privado
router.put('/:id',
[
    validarJWT,
    tieneRol("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(esProdValido),
    validarCampos
],actualizarProducto)

// borrar un producto - restringido
router.delete('/:id',[
    validarJWT,
    esAdmin,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(esProdValido),
    validarCampos
], borrarProducto)

module.exports = router