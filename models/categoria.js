const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {type: String, required: [true, 'El nombre es obligatorio'], unique: true},
    estado: {type: Boolean, required: true, default: true},
    fechaRegistro: {type: Date, default: Date.now},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true}
});

module.exports = model('Categoria', CategoriaSchema);