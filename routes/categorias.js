const {Router} = require('express');
const {check} = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { esCatValido } = require('../helpers/dbValidators');

const {validarCampos,validarJWT, tieneRol, esAdmin} = require('../middlewares');

const router = Router();

// obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// obtener una categoria por id - publico
router.get('/:id',[
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(esCatValido),
    validarCampos
],obtenerCategoria);

// crear categoria - privado
router.post('/',[
    validarJWT,
    tieneRol("ADMIN_ROLE","VENTAS_ROLE"),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

// actualizar un registro por id - privado
router.put('/:id',[
    validarJWT,
    tieneRol("ADMIN_ROLE", "VENTAS_ROLE"),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(esCatValido),
    validarCampos
],actualizarCategoria);

// borrar una categoria - restringido
router.delete('/:id',[
    validarJWT,
    esAdmin,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(esCatValido),
    validarCampos
],borrarCategoria);

module.exports = router ;