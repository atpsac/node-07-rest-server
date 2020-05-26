const mongoose = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

let Schema = mongoose.Schema;

let categoriaSchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es necesario'],
            unique: true
        },
        descripcion: {
            type: String,
            required: [true, 'La descripción es necesaria']
        },
        estado: {
            type: Boolean,
            default: true
        },
        usuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    }
);

categoriaSchema.plugin( uniqueValidator, { message: '{PATH} debe ser única' } );

module.exports = mongoose.model( 'Categoria', categoriaSchema );