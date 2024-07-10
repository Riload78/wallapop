const { Usuario, Agente } = require('../models')
const createError = require('http-errors')

class PrivateController {

  async index(req, res, next) {
    try {
      // obtener el id del usuario de la sesión
      const userId = req.session.userId;

      // buscamos el usuario en la base de datos
      const usuario = await Usuario.findById(userId)

      if (!usuario) {
        next(createError(500, 'user not found'))
        return
      }

      // cargar lista de agentes que pertenecen al usuario
      const agentes = await Agente.find({ owner: userId })

      res.render('private', {
        email: usuario.email,
        agentes
      });

    } catch (error) {
      next(error)
    }
  }

}

module.exports = PrivateController;