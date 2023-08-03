
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
// const { validationResult } = require('express-validator');

const usuariosGet = async( req = request, res = response ) => {

  // const { q, nombre = 'no name', apikey } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  // const usuarios = await Usuario.find({ estado: true })
  //   .skip(Number(desde))
  //   .limit(Number(limite));

  // const total = await Usuario.countDocuments({ estado: true });

  const [ total, usuarios ] = await Promise.all([
    Usuario.countDocuments({ estado: true }),
    Usuario.find({ estado: true })
    .skip(Number(desde))
    .limit(Number(limite))
  ])

  res.json({
    // resp,
    total,
    usuarios
  });
}

const usuariosPut = async ( req, res = response ) => {

  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  // TODO validar contra base de datos
  if ( password ) {
    // Encriptar el password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync( password, salt );
  }

  const usuario = await Usuario.findByIdAndUpdate( id, resto );

  res.json(usuario);
}

const usuariosPatch = ( req, res = response ) => {
  res.json({
    msg: 'path API - controlador'
  });
}

const usuariosPost = async ( req, res = response ) => {

  

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({
    nombre,
    correo,
    password,
    rol
  });

  

  // Encriptar el password
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync( password, salt );

  //Guardar en BD

  await usuario.save();

  res.json({
    usuario
  });
}

const usuariosDelete = async( req, res = response ) => {

  const { id } = req.params;

  // Fisicamente lo borramos
  // const usuario = await Usuario.findByIdAndDelete( id );

  const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });

  res.json(usuario);
}

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch
}