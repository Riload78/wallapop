var express = require('express');
var router = express.Router();
const { query, custom, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {

  const now = new Date()

  res.locals.esPar = (now.getSeconds() % 2) === 0;
  res.locals.segundoActual = now.getSeconds();
  res.locals.inyeccion = '<script>alert("inyectado!")</script>'
  res.locals.texto = res.__('Hello')

  res.locals.users = [
    { name: 'Smith', age: 34 },
    { name: 'Brown', age: 43 },
  ]

  res.render('index', { otracosa: 'Express' });
});

// GET /parametro_en_ruta/54
// GET /parametro_en_ruta/54?talla=s&color=rojo
router.get('/parametro_en_ruta/:numero', (req, res, next) => {
  const numero = req.params.numero;
  const talla = req.query.talla;
  const color = req.query.color;

  res.send('he recibido el número ' + numero + ', talla ' + talla + ' color ' + color);
});

// GET /parametro_opcional/:numero? OPCIONAL
router.get('/parametro_opcional/:numero?', (req, res, next) => {
  const numero = req.params.numero;

  res.send('he recibido el número opcional: ' + numero);

});

// Recibir parametros con filtro por Regex
router.get('/producto/:nombre/talla/:talla([0-9]+)/color/:color', (req, res, next) => {
  const nombre = req.params.nombre;
  const talla = req.params.talla;
  const color = req.params.color;

  res.send(`Me pedíste ${nombre} talla ${talla} color ${color}`);
});

// POST /usuario
// Crear un usuario
router.post('/usuario', (req, res, next) => {
  console.log(req.body);

  const apiKey = req.get('api-key')
  console.log(apiKey)

  res.send('ok')
});

// GET /enquerystring?age=20
router.get('/enquerystring', [ // validations
    query('age').isNumeric().withMessage('must be numeric'),
    query('talla').custom(value => {
      if (value > 5) return true
      else return false;
     }).withMessage('must be greater that 5')
  ],
  (req, res, next) => {
  validationResult(req).throw(); // lanza excepción si hay errores de validación

  res.send('ok');
})

module.exports = router;
