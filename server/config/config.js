// Puerto

process.env.PORT = process.env.PORT || 3000;

// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// Seed de autenticación

process.env.SEED = process.env.SEED || 'seeddev';

// Base de datos

let urlDb;

if ( process.env.NODE_ENV === 'dev' ) {

    urlDb = 'mongodb://localhost:27017/cafe';

} else {

    urlDb = process.env.MONGO_URI;

}

process.env.URLDB = urlDb;

// Google Client ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '277348493452-enj86mb4aeq9pjt1rclaj2jouqp2d1f0.apps.googleusercontent.com';
