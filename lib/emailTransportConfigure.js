const nodemailer = require('nodemailer');

// módulo que exporta una función
module.exports = async function() {

  const testAccount = await nodemailer.createTestAccount();

  const developmentOptions = {
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  }

  const productionOptions = {
    service: process.env.EMAIL_SERVICE_NAME,
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    }
  }

  const transport = nodemailer.createTransport(process.env.NODEAPP_ENV === 'development' ?
    developmentOptions:
    productionOptions
  );

  return transport;
}