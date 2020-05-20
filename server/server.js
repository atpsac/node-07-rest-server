require( './config/config' );

const express = require('express');
const mongoose = require( 'mongoose' );

const app = express();

const bodyParser = require('body-parser')
 
// parse application/json
app.use( bodyParser.urlencoded({ extended: false }) );

app.use( bodyParser.json() );

// requiriendo ruta usuarios
app.use( require( './routes/usuario' ) );

// Conexión a base de datos

mongoose.connect('mongodb://localhost:27017/cafe', ( err, res ) => {
    if ( err ) {
        throw err;
    }

    console.log( 'base de datos online' );

});
 
app.listen( process.env.PORT, () => {
    console.log(`Escuchando en el puerto: ${ process.env.PORT }`);
});