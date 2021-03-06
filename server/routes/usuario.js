const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const { verificaToken } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {

    let desde = Number( req.query.desde || 0 );
    let limite = Number( req.query.limite || 5 );

    Usuario.find( { estado: true }, 'nombre email role' )
        .skip( desde )
        .limit( limite )
        .exec( (err, usuarios) => {

            if ( err ) {
                return res.status( 400 ).json({
                    ok: false,
                    err
                });
            }

            Usuario.count( { estado: true }, ( err, conteo ) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            } );
    } );

  });
  
  app.post('/usuario', (req, res) => {
      
      let body = req.body;

      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync( body.password, 10 ),
          role: body.role
      });

      usuario.save( ( err, usuarioDB ) => {

        if ( err ) {
            return res.status( 400 ).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

      });
      
    });
  
  app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick( req.body, [ 'nombre', 'email', 'img', 'role', 'estado' ] );

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, ( err, usuarioDB ) => {

        if ( err ) {
            return res.status(400).json( {
                ok: false,
                err
            });
        }

        res.json(
            {
                ok: true,
                usuario: usuarioDB
            }
        );

    });

  });
  
  app.delete('/usuario/:id', (req, res) => {
      
    // Borrar permanentemente un usuario
    
    // let id = req.params.id;

    // Usuario.findByIdAndRemove( id, ( err, usuarioBorrado ) => {
        
    //     if ( err ) {
    //         return res.status(400).json( {
    //             ok: false,
    //             err
    //         });
    //     }

    //     if ( !usuarioBorrado ) {
            
    //         return res.status(400).json( {
    //             ok: false,
    //             error: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });

    //     }

    //     res.json( {
    //         ok: true,
    //         usuarioBorrado
    //     });

    // });
    
    let id = req.params.id;
    let cambiaEstado = { estado: false };

    Usuario.findByIdAndUpdate( id, cambiaEstado, { new: true }, ( err, usuarioDB ) => {

        if ( err ) {
            return res.status(400).json( {
                ok: false,
                err
            });
        }

        res.json(
            {
                ok: true,
                usuario: usuarioDB
            }
        );

    });
    

  });

  module.exports = app;