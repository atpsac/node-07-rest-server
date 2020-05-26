const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');
const _ = require('underscore');

app.get('/categoria', verificaToken,(req, res) => {
    
    Categoria.find({ estado: true }, 'nombre descripcion')
        .sort( 'nombre' )
        .populate( 'usuario', 'nombre email' )
        .exec((err, categorias) => {
            if ( err ) {
                return res.estatus( 400 ).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({ estado: true }, ( err , conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                });
            });

        });
});

app.get('/categoria/:id', (req, res) => {
    
    let id = req.params.id;
    
    Categoria.findById(id, 'nombre descripcion', { estado: true })
        .populate( 'usuario', 'nombre email' )
        .exec((err, categoriaDB) => {
            if ( err ) {
                return res.estatus( 500 ).json({
                    ok: false,
                    err
                });
            }

            if ( !categoriaDB ) {
                return res.status( 400 ).json({
                    ok: false,
                    err: {
                        message: 'El id no es válido'
                    }
                });
            }
                
            res.json({
                ok: true,
                categoriaDB
            });
        });
});


app.post('/categoria', verificaToken, (req, res) => {
      
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( ( err, categoriaDB ) => {

      if ( err ) {
        return res.status( 500 ).json({
            ok: false,
            err
          });
      }

      if ( !categoriaDB ) {
        return res.status( 400 ).json({
            ok: false,
            err
        });
      }

      res.json({
          ok: true,
          categoria: categoriaDB
      });

    });
});

app.put('/categoria/:id', verificaToken,(req, res) => {

    let id = req.params.id;
    let body = _.pick( req.body, [ 'nombre', 'descripcion' ] );
    
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, ( err, categoriaDB ) => {
        if ( err ) {
            return res.status(500).json( {
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status( 400 ).json({
                ok: false,
                err
            });
        }

        res.json(
            {
                ok: true,
                categoria: categoriaDB
            }
        );
    });

});

app.delete('/categoria/:id',[ verificaToken, verificaAdmin_Role ] , ( req, res ) => {

    let id = req.params.id;
    let cambiaEstado = { estado: false };

    Categoria.findByIdAndUpdate( id, cambiaEstado, { new: true }, ( err, categoriaDB ) => {
        if ( err ) {
            return res.status(500).json( {
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status( 400 ).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json(
            {
                ok: true,
                categoria: categoriaDB
            }
        );

    });
});

module.exports = app;