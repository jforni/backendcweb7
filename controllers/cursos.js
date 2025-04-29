const { response, request } = require('express');
const Curso = require('../models/curso');

//Get para traer todos los cursos
const cursosGet = async (req=request, res=response) => {
    const {desde = 0, limite = 5} = req.query;
    const query = {estado: true};

    const [total, cursos] = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
     /*        .populate('usuario','correo') */
            .populate('categoria', 'nombre'),
    ]);

    res.json({
        msg: 'Cursos obtenidos',
        total,
        cursos,
    })
};

//Get para traer un curso por ID
const cursoGet = async (req=request, res=response) => {
    const {id} = req.params;

    const curso = await Curso.findById(id)
        /* .populate('usuario', 'correo') */
        .populate('categoria', 'nombre');

    res.json({
        msg: 'Curso obtenido según lo pedido',
        curso
    })
};

//Crear un curso
const cursoPost = async (req=request, res=response) => {
    const {precio, categoria, descripcion, img} = req.body;
    const nombre = req.body.nombre.toUpperCase();

    const cursoDB= await Curso.findOne({nombre});

    //validar si el curso existe
    if(cursoDB){
        return res.status(400).json({
            msg: `El curso ${cursoDB.nombre} ya existe`,
        })
    }

    //Generar la data a guardar en DB del curso
    const data = { nombre, categoria, precio, descripcion, img, usuario:req.usuario._id}

    const curso = new Curso(data)

    //Grabar en BD
    await curso.save();

    res.status(201).json({
        msg: 'Curso creado con éxito!',
        curso,
    });
}

//Modificar un curso
const cursoPut = async (req, res) => {
    const {id} = req.params;
    const {precio, categoria, descripcion, destacado, img} = req.body;

    const usuario = req.usuario_id;
    
    let data ={
        precio, descripcion, categoria, destacado, img, usuario
    };

    //Si viene el nombre del curso
    if(req.body.nombre){
        data.nombre = req.body.nombre.toUpperCase();
    }

    const curso = await Curso.findByIdAndUpdate(id, data, {new:true});

    res.status(201).json({
        msg: 'El curso se actualizó',
        curso
    });
}

//Inhabilitar un curso
const cursoDelete = async (req, res) => {
    const {id} = req.params;

    const cursoInactivo = await Curso.findByIdAndUpdate(id, {estado: false}, {new:true});

    res.json({
        msg: `El curso ${cursoInactivo.nombre} se inactivó`,
        cursoInactivo
    });
};

module.exports = {
    cursosGet,
    cursoGet,
    cursoPost,
    cursoPut,
    cursoDelete
};