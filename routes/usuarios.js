const { Router } = require("express");
const { check } = require("express-validator");

// const { validarCampos } = require("../middlewares/validar-campos");
// const { validarJWT } = require("../middlewares/validar-jwt");
// const {esAdminRole, tieneRole} = require("../middlewares/validar-roles");

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

const {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");
const {
  usuariosGET,
  usuariosPUT,
  usuariosPOST,
  usuariosDELETE,
  usuariosPATCH,
} = require("../controllers/usuarios");

const router = Router();

router.get("/", usuariosGET);

router.put(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom((rol) => esRolValido(rol)),
    validarCampos,
  ],
  usuariosPUT
);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe ser mayor a 6 letras").isLength({
      min: 6,
    }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom((correo) => emailExiste(correo)),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check("rol").custom((rol) => esRolValido(rol)),
    validarCampos,
  ],
  usuariosPOST
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "NOSE_ROLE"),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDELETE
);

router.patch("/", usuariosPATCH);

module.exports = router;
