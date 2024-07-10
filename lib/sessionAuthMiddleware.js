// modulko que exporta un middleware que controla si el cliente está logado o no

module.exports = (req, res, next) => {
  // si el usuario que hace la petición
  // no tienen en su sesión la variable userId
  // es que no ha hecho login
  if (!req.session.userId) {
    res.redirect('/login');
    return;
  }
  next();
}