const basicAuth = require('basic-auth');

module.exports = (req, res, next) => {
  const user = basicAuth(req);
    if (!user || user.name !== 'admin' || user.pass !== '1234') {
      // no está autorizado a pasar
      res.set('WWW-Authenticate', 'Basic realm=Authozation required');
      res.sendStatus(401);
      return;
    }
    next();
}