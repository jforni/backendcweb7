const { response, request } = require('express');
const Usuario = require('../models/usuario');

const usuarioGet = async (req = request, res = response) => {
  const {desde=0, limite=5} = req.query;
  const query = {estado:true};

  const [ total, usuarios ] = await Promise.all([Usuario.countDocuments(query), Usuario.find(query).skip(desde).limit(limite)]);

  res.json({
    mensaje: "Usuarios obtenidos",
    total, 
    usuarios
  });
}

const usuarioGetID = async (req = request, res = response) => {
  const {id} = req.params;

  const usuario = await Usuario.findById(id)

  res.json({
    mensaje: "Usuario obtenido",
    usuario
  })
}

const usuarioPost = async (req=request, res=response) => {
  //Recibir el cuerpo de la petición 
  const datos = req.body;
  console.log(datos)
  const { nombre, apellido, correo, password, edad, rol} = datos;
  const usuario = new Usuario({nombre, apellido, correo, password, edad, rol});

  //Encriptar la contraseña

  //Guardar los datos en la BD
  await usuario.save();

  res.json({
    mensaje: "Usuario cargado correctamente",
    usuario
  })
}

const usuarioPut = async (req = request, res = response) => {
  const {id} = req.params;

  //Obtener datos para actualizar
  const {password, correo, ...resto} = req.body;

  //Si actualiza el password, debo encriptarlo

  //Modificación de los datos
  resto.correo = correo;
  resto.password = password;

  //Buscar el usuario y actualizarlo
  const usuario = await Usuario.findByIdAndUpdate(id, resto, {new:true});

  res.json({
    mensaje: "Usuario acualizado correctamente",
    usuario
  })
}

const usuarioDelete = async (req = request, res = response) => {
  const {id} = req.params;

  //Para eliminar el registro fisicamente
  /* const usuarioBorrado = await Usuario.findByIdAndDelete(id); */

  //Para cambiar el estado a false
  const usuario = await Usuario.findById(id);

  if(!usuario.estado){
    return res.json({
      mensaje: "Usuario no existe"
    })
  }

  const usuarioInhabilitado = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});

  res.json({
    mensaje: "Usuario inhabilitado",
    usuarioInhabilitado
    /* mensaje: "Usuario eliminado correctamente",
    usuarioBorrado */
  })
}

module.exports = {
  usuarioGet,
  usuarioGetID,
  usuarioPost,
  usuarioPut,
  usuarioDelete
}