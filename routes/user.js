const { Router } = require("express");
const { check } = require("express-validator");

const {
  usersGet,
  userPut,
  usersPost,
  usersDelete,
} = require("../controllers/user");

const {
  esRolValido,
  esEmailValido,
  esIdValido,
} = require("../helpers/dbValidators");

const {
  validarCampos,
  validarJWT,
  esAdmin,
  tieneRol,
} = require("../middlewares");

const router = Router();

router.get("/", usersGet);

router.put(
  "/:id",
  check("id", "No es un ID valido").isMongoId(),
  check("id").custom(esIdValido),
  validarCampos,
  userPut
);

router.post(
  "/",
  [
    check("correo", "correo no valido").isEmail(),
    check("correo").custom(esEmailValido),
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("password", "el password es obligatorio y +6 letras").isLength(6),
    //check('role','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check("role").custom(esRolValido), // en este caso, el primer argumento se envia directamente al esRolValido (es: (rol)=>esRolValido(rol))
    validarCampos,
  ],
  usersPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    //esAdmin,
    tieneRol("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(esIdValido),
    validarCampos,
  ],
  usersDelete
);

module.exports = router;
