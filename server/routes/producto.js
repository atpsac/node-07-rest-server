const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');
const _ = require('underscore');

// Obtener todos los productos

app.get('/producto', verificaToken,(req, res) => {
    
    let desde = Number( req.query.desde || 0 );
    let limite = Number( req.query.limite || 5 );

    Producto.find({ disponible: true })
        .skip( desde )
        .limit( limite )
        .sort( 'nombre' )
        .populate( 'usuario', 'nombre email' )
        .populate( 'categoria', 'nombre descripcion' )
        .exec((err, productos) => {
            if ( err ) {
                return res.estatus( 500 ).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, ( err , conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });

        });
});

// Obtener producto por id

app.get('/producto/:id', verificaToken,(req, res) => {
    
    let id = req.params.id;

    Producto.findById( id )
        .sort( 'nombre' )
        .populate( 'usuario', 'nombre email' )
        .populate( 'categoria', 'nombre descripcion' )
        .exec((err, productoDB) => {
            if ( err ) {
                return res.status( 500 ).json({
                    ok: false,
                    err
                });
            }

            if ( !productoDB ) {
                return res.status( 400 ).json({
                    ok: false,
                    err: {
                        message: 'El id no es válido'
                    }
                });
            }
                
            res.json({
                ok: true,
                productoDB
            });

        });
});

// Buscar productos

app.get('/producto/buscar/:termino', verificaToken, ( req, res ) => {

    let termino = req.params.termino;

    let regex = new RegExp( termino, 'i' );

    Producto.find({ nombre: regex })
        .populate( 'categoria', 'nombre')
        .exec( ( err, productoDB ) => {
            
            if ( err ) {
                return res.estatus( 500 ).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        } );

});

// Crear nuevo producto

app.post('/producto', verificaToken, (req, res) => {
      
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( ( err, productoDB ) => {

      if ( err ) {
        return res.status( 500 ).json({
            ok: false,
            err
          });
      }

      if ( !productoDB ) {
        return res.status( 400 ).json({
            ok: false,
            err
        });
      }

      res.status( 201 ).json({
          ok: true,
          producto: productoDB
      });

    });
});

// Actualizar producto

app.put('/producto/:id', verificaToken,(req, res) => {

    let id = req.params.id;
    let body = _.pick( req.body, [ 'nombre', 'precioUni', 'descripcion', 'categoria' ] );
    
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, ( err, productoDB ) => {
        if ( err ) {
            return res.status(500).json( {
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status( 400 ).json({
                ok: false,
                err
            });
        }

        res.json(
            {
                ok: true,
                producto: productoDB
            }
        );
    });

});

// Borrar productos

app.delete('/producto/:id',[ verificaToken ] , ( req, res ) => {

    let id = req.params.id;
    let cambiaEstado = { estado: false };

    Producto.findByIdAndUpdate( id, cambiaEstado, { new: true }, ( err, productoDB ) => {
        if ( err ) {
            return res.status(500).json( {
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
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
                producto: productoDB
            }
        );

    });
});



module.exports = app;