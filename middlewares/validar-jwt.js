const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const usuario = require("../models/usuario");

const validarJWT = async(req = request, resp = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return resp.status(401).json({
      msg: "no hay token en la peticion",
    });
  }

  try {
    const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
 
    // Leer usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    if(!usuario){
        return resp.status(401).json({
            msg: 'Usuario no existe en DB'
        })
    }


    // verificar si el uid tiene estado true
    if(usuario.estado ===false ){
        return resp.status(401).json({
            msg: 'Token no valido - usuario con estado false'
        })
    }

    req.usuario= usuario;
    


    next();
  

} catch (error) {
    console.log(error);
    resp.status(401).json({
        msg: 'Token no valido'
    })
  }
};

module.exports = {
  validarJWT,
};
