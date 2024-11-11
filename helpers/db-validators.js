const Role = require("../models/role");
const Usuario = require("../models/usuario")

const esRolValido = async (rol='')=>{
    const existeRol = await Role.findOne({rol:rol});
    if(!existeRol){
      throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
  }

const emailExiste = async (correo ='', req)=>{
  const existeEmail = await Usuario.findOne({correo:correo})

  if(existeEmail){
    throw new Error(`el email ${correo} ya existe en el sistema`);
    }
}

const existeUsuarioPorId = async (id='')=>{
  const existeUsuario = await Usuario.findById(id);

  if(!existeUsuario){
    throw new Error(`el id ${id} no existe`);
    }
}


  module.exports = {esRolValido, emailExiste, existeUsuarioPorId}
