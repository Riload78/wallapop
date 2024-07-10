const createError = require('http-errors');
const { Agente } = require('../models');

class AgentsController {
  new(req, res, next) {
    res.locals.error = '';
    res.render('agente-new');
  }

  async postNewAgent(req, res, next) {
    try {
      const { name, age } = req.body;
      const userId = req.session.userId;

      const agente = await Agente.create({
        name,
        age,
        owner: userId
      });

      res.redirect('/private');

    } catch (error) {
      next(error);
    }
  }

  async deleteAgent(req, res, next) {
    try {
      const agenteId = req.params.agenteId;
      const userId = req.session.userId;

      // validar que el agente que queremos borrar es propiedad del usuario
      const agente = await Agente.findOne({ _id: agenteId });

      // verifico que existe
      if (!agente) {
        console.warn(`WARNING - el usuario ${userId} intentó eliminar un agente (${agenteId}) inexistente.`);
        next(createError(404, 'Not found'));
        return;
      }

      // agente.owner viene de la base de datos y es de tipo object!!
      if (agente.owner.toString() !== userId) {
        console.warn(`WARNING - el usuario ${userId} intentó eliminar un agente (${agenteId}) propiedad de otro usuario.`);
        next(createError(403, 'Forbidden'));
        return;
      }

      await Agente.deleteOne({ _id : agenteId, owner: userId });

      res.redirect('/private');

    } catch (error) {
      next(error);
    }
  }
}

module.exports = AgentsController