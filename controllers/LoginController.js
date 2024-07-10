const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

class LoginController {

  index(req, res, next) {
    res.locals.error = '';
    res.locals.email = '';
    res.render('login')
  }

  async post(req, res, next) {
    try {
      const { email, password } = req.body;

      // buscar el usuario en la base de datos
      const usuario = await Usuario.findOne({ email: email })

      // si no lo encuentro o la contraseña no coincide, error
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.locals.error = res.__('Invalid credentials');
        res.locals.email = email;
        res.render('login');
        return;
      }

      req.session.userId = usuario._id;

      // enviar un email al usuario con bienvenida
      usuario.enviaEmail('Bienvenido', 'Bienvenido a NodeApp.');

      // si existe y la contraseña coincide, redirigir a la zona privada
      res.redirect('/private');

    } catch (error) {
      next(error);
    }
  }

  logout(req, res, next) {
    req.session.regenerate(err => {
      if (err) {
        next(err);
        return;
      }
      res.redirect('/');
    })
  }

  async postAPIJWT(req, res, next) {
    try {
      const { email, password} = req.body;

      // buscar el usuario en la BD
      const usuario = await Usuario.findOne({ email: email });

      // si no lo encuentro o no coincide la contraseña --> error
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.json({ error: 'invalid credentials' });
        return;
      }

      // si lo encuentro y la contraseña está bien --> emitir un JWT
      const tokenJWT = await jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET, {
        expiresIn: '2h'
      });

      res.json({ tokenJWT: tokenJWT });

    } catch (error) {
      next(error)
    }
  }

}

module.exports = LoginController