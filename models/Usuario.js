const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const createTransport = require('../lib/emailTransportConfigure');

// creamos esquema
const usuarioSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String
})

// método estático que hace hash de una contraseña
usuarioSchema.statics.hashPassword = function(passwordEnClaro) {
  return bcrypt.hash(passwordEnClaro, 10);
}

// método de instancia que comprueba la password de un usuario
usuarioSchema.methods.comparePassword = function(passwordEnClaro) {
  return bcrypt.compare(passwordEnClaro, this.password);
}

// método (de instancia) para enviar emails al usuario
usuarioSchema.methods.enviaEmail = async function(asunto, cuerpo) {
  // crear un transporter
  const transport = await createTransport();

  // enviar el email
  const result = await transport.sendMail({
    from: process.env.EMAIL_SERVICE_FROM,
    to: this.email,
    subject: asunto,
    // text --> para texto plano
    html: cuerpo,
  });

  console.log(`URL de previsualización: ${nodemailer.getTestMessageUrl(result)}`);
  return result;
}

// creamos el modelo de usuarios
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;