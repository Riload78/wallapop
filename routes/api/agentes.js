var express = require('express');
var router = express.Router();
const Agente = require('../../models/Agente');
const upload = require('../../lib/publicUploadConfigure');

/**
 * @openapi
 * /api/agentes:
 *  get:
 *    description: Devuelve una lista de agentes
 *    responses:
 *      200:
 *        description: Devuelve un JSON
 */
router.get('/', async function(req, res, next) {
  try {
    const userId = req.apiUserId;
    // filtros
    // http://127.0.0.1:3000/api/agentes?age=19
    const filterByName = req.query.name;
    const filterByAge = req.query.age;
    // paginación
    // http://127.0.0.1:3000/api/agentes?skip=2&limit=2
    const skip = req.query.skip;
    const limit = req.query.limit;
    // ordenación
    // http://127.0.0.1:3000/api/agentes?sort=-age%20name
    const sort = req.query.sort;
    // field selection
    // http://127.0.0.1:3000/api/agentes?fields=age%20-_id
    const fields = req.query.fields;

    const filter = { owner: userId };

    if (filterByName) {
      filter.name = filterByName;
    }

    if (filterByAge) {
      filter.age = filterByAge;
    }

    const agentes = await Agente.listar(filter, skip, limit, sort, fields);

    res.json({ results: agentes });
  } catch (error) {
    next(error)
  }
});

// GET /api/agentes/<_id>
// Devuelve un agente
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const agente = await Agente.findById(id);

    res.json({ result: agente })
  } catch (error) {
    next(error);
  }
});

// PUT /api/agentes/<_id> (body)
// Actualiza un agente
router.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const agenteActualizado = await Agente.findByIdAndUpdate(id, data, { new: true });

    res.json({ result: agenteActualizado });

  } catch (error) {
    next(error);
  }
});

// POST /api/agentes (body)
// Crea un agente
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const data = req.body;

    // creamos una instancia de agente en memoria
    const agente = new Agente(data);
    agente.avatar = req.file.filename;

    // lo persistimos en la BD
    const agenteGuardado = await agente.save();

    res.json({ result: agenteGuardado });

  } catch (error) {
    next(error);
  }
});

// DELETE /api/agentes/<_id>
// Elimina un agente
router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    await Agente.deleteOne({ _id: id });

    res.json();
  } catch (error) {
    next(error);
  }
})

module.exports = router;