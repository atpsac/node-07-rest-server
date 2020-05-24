require( './config/config' );

const express = require('express');
const mongoose = require( 'mongoose' );
const path = require( 'path' );

const app = express();

const bodyParser = require('body-parser')
 
// parse application/json
app.use( bodyParser.urlencoded({ extended: false }) );

app.use( bodyParser.json() );

// Habilitar directorio public

app.use( express.static(path.resolve( __dirname, '../public' ) ) );


// Configuración global de rutas
app.use( require( './routes/index' ) );

// Conexión a base de datos

mongoose.connect( process.env.URLDB,
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
                ( err, res ) => {
    if ( err ) {
        throw err;
    }

    console.log( 'base de datos online' );

});
 
app.listen( process.env.PORT, () => {
    console.log(`Escuchando en el puerto: ${ process.env.PORT }`);
});