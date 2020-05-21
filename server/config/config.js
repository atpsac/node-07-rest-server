// Puerto

process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos

let urlDb;

if ( process.env.NODE_ENV === 'dev' ) {

    urlDb = 'mongodb://localhost:27017/cafe';

} else {

    urlDb = 'mongodb+srv://admin:Am4z0n4s*@cluster0-sjkow.mongodb.net/cafe?retryWrites=true&w=majority';


}

process.env.URLDB = urlDb;

