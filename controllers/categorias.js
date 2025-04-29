const { response, request } = require('express') ;
const Categoria = require('../models/categoria');

const categoriasGet = async (req=request, res=response)  => {
    //Obtener todas las categorías paginadas con el total
    const {desde = 0, limite = 5} = req.query;
    const query = {estado:true}

    const [total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(desde)
            .limit(limite)
            /* .populate('usuario', 'correo') */
    ])

    res.json({
        total,
        categorias,
        msg: 'Categorías obtenidas'
    })
}

const categoriaGet = async (req=request, res=response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre apellido correo');

    res.json({
        msg: 'Categoría obtenida según pedido del usuario',
        categoria
    })
}

const categoriaPost = async (req=request, res=response) => {
    const nombre = req.body.nombre.toUpperCase(); 

    //Verificar si la categoria ya existe
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe` 
        })
    };

    //Generar la data que vamos a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json({
        msg: `Categoría ${categoria.nombre} creada con éxito`,
        categoria
    })
}

const categoriaPut = async (req=request, res=response ) => {
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const usuario = req.usuario._id;

    const data = {
        nombre, 
        usuario
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

    res.status(201).json({
        categoria,
        msg: 'Categoría actualizada correctamente'
    })
}

const categoriaDelete =  async (req=request, res=response) => {
    const {id} = req.params;

    const categoriaInactiva = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json({
        categoriaInactiva,
        msg: 'La categoría fue eliminada correctamente | inactivada',
    })
}

module.exports = {
    categoriasGet,
    categoriaGet,
    categoriaPost,
    categoriaPut,
    categoriaDelete
}