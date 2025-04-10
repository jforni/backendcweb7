const { Router } = require('express');
const { usuarioGet, usuarioGetID, usuarioPost, usuarioDelete, usuarioPut } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuarioGet);

router.get('/:id', usuarioGetID );

router.post('/', usuarioPost);

router.put('/:id', usuarioPut);

router.delete('/:id', usuarioDelete);

module.exports = router;