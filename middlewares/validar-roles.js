const {request, response} = require('express');

const esAdminRole = (req=request, res=response, next) => {
    if(!req.usuario){
        //No validamos el token antes
        return res.status(500).json({
            msg: "Se quiere validar el rol sin validar el token"
        });
    }

    const {rol, nombre, apellido} = req.usuario;

    if( rol !== "Admin"){
        return res.status(401).json({
            msg: `${nombre} ${apellido} no es Administrador del sistema`
        });
    }

    next();
};

module.exports = {
    esAdminRole,
}