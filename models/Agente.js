const mongoose = require('mongoose');

// definir el esquema de los agentes
const agenteSchema = mongoose.Schema({
  name: { type: String, unique: true },
  age: { type: Number, required: true, index: true },
  owner: { ref: 'Usuario', type: mongoose.Schema.ObjectId },
  avatar: String,
}, {
  // collection: 'acelgas' // para forzar el nombre de la colección y evitar la pluralización automática
});

// método listar (estáico, porque está en el modelo)
agenteSchema.statics.listar = function(filtro, skip, limit, sort, fields) {
  const query = Agente.find(filtro);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec();
}


// crear el modelo de agente
const Agente = mongoose.model('Agente', agenteSchema);

// (opcional) exportar el modelo
module.exports = Agente;