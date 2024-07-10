const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    info: {
      title: 'NodeApp API',
      version: '0.1',
      description: 'API de Agentes'
    }
  },
  // apis: ['swagger.yml']
  apis: ['./routes/**/*.js', './controllers/**/*.js']
}

const especification = swaggerJSDoc(options);

module.exports = [swaggerUI.serve, swaggerUI.setup(especification)];