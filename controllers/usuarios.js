const { respoonse, request } = require("express");
const bcryptjs = require("bcryptjs");
("express-validator");

const Usuario = require("../models/usuario");
const { emailExiste } = require("../helpers/db-validators");





const usuariosGET = async (req = request, res = response) => {

  const { limite = 5, desde = 0 } = req.query;
  const query = {estado: true};
  
  // const usuarios = await Usuario.find( query )
  //     .skip(desde)
  //     .limit(limite);


  // const total = await Usuario.countDocuments( query );


   const [total, usuarios] = await Promise.all([
    Usuario.countDocuments( query ),
    Usuario.find( query )
      .skip(desde)
      .limit(limite)
  ])
 
  

  res.json({
    total,
    usuarios,
  });
};





const usuariosPUT = async (req, res) => {
  // ENCRIPTAR CONTRASEÑA
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if (password) {
    // ENCRIPTAR CONTRASEÑA
    const salt = bcryptjs.genSaltSync(10);
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

const usuariosPOST = async (req, res) => {
  // Validando Errores

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la constraseña
  const salt = bcryptjs.genSaltSync(10);
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD

  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosDELETE = async (req, res) => {

  const {id} = req.params;

  // Borrando Fisicamente el usuario
  // const usuario = await Usuario.findByIdAndDelete( id)

  const usuario = await Usuario.findByIdAndUpdate(id, {estado:false})


  res.json({
    usuario,
  });
};

const usuariosPATCH = (req, res) => {
  res.json({
    msj: "patch API - controlador",
  });
};

module.exports = {
  usuariosGET,
  usuariosPUT,
  usuariosPOST,
  usuariosDELETE,
  usuariosPATCH,
};
