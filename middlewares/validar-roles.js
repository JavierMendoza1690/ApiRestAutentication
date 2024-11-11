const { response, request } = require("express");



const esAdminRole = ((req=request, resp=response, next)=>{

    if(!req.usuario){
        return resp.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

        const { rol, nombre }=req.usuario;

        if( rol !== 'ADMIN_ROLE'){
            return resp.status(401).json({
                msg: `${nombre} no es administrador - No puede hacer esto`
            })
        }
    
    next();
});

const tieneRole = (...roles)=>{

    return ((req, resp, next)=>{

        if(!req.usuario){
            return resp.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }
       

        if(!roles.includes(req.usuario.rol)){
            return resp.status(401).json({
                msg: `el servicio requiere uno de estos roles ${roles}`
            })
        }
    
    
        next();
    })
}

module.exports = {
    esAdminRole, 
    tieneRole,
};