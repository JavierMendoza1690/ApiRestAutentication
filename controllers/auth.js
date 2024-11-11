const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt.js");
const { googleVerify } = require("../helpers/google-verify.js");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // verificar si el email existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - Usuario",
      });
    }

    // verificar si el usuario esta activo

    if (usuario.estado === false) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos- estado: false",
      });
    }

    // verifica la contraseña

    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos- password",
      });
    }

    // generar el JWT

    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Algo salio mal, hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {

    const {nombre, img, correo} = await googleVerify(id_token)
   
    res.json({
      msg: "Todo bien",
      id_token,
    });
    
  } catch (error) {
    res.status(400).json({
      mgs:'El token no se pudo verificar'
    })
  }


};

module.exports = {
  login,
  googleSignIn,
};
