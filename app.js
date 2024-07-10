var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const basicAuth = require('./lib/basicAuthMiddleware');
const sessionAuth = require('./lib/sessionAuthMiddleware');
const jwtAuth = require('./lib/jwtAuthMiddleware');
const i18n = require('./lib/i18nConfigure');
const FeaturesController = require('./controllers/FeaturesController');
const LangController = require('./controllers/LangController');
const LoginController = require('./controllers/LoginController');
const PrivateController = require('./controllers/PrivateController');
const AgentsController = require('./controllers/AgentsController');
const swaggerMiddleware = require('./lib/swaggerMiddleware');


const featuresController = new FeaturesController();
const langController = new LangController();
const loginController = new LoginController();
const privateController = new PrivateController();
const agentsController = new AgentsController();

require('./lib/connectMongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * Middlewares
 */

app.locals.title = 'NodeApp';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Rutas del API
 */
app.use('/api-doc', swaggerMiddleware);
app.post('/api/login', loginController.postAPIJWT);
app.use('/api/agentes', jwtAuth, require('./routes/api/agentes'));

/**
 * Rutas del Website
 */
app.use(i18n.init);
app.use(session({
  name: 'nodeapp-session', // nombre de la cookie
  secret: 'sd7869f6789sfd8796sda87fsd978f768sdf8679s',
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 2 // 2d - expiración de la sesión por inactividad
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL
  })
}))
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})
app.use('/',      require('./routes/index'));
app.use('/users', require('./routes/users'));
// cambiamos al estilo de controladores
app.get('/features', featuresController.index);
app.get('/change-locale/:locale', langController.changeLocale);
app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/private', sessionAuth, privateController.index);
app.get('/logout', loginController.logout);
app.get('/agents-new', agentsController.new);
app.post('/agents-new', agentsController.postNewAgent);
app.get('/agents-delete/:agenteId', agentsController.deleteAgent);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // errores de validación
  if (err.array) {
    const errInfo = err.array({ })[0];
    console.log(errInfo);
    err.message = `Not valid - ${errInfo.type} ${errInfo.path} in ${errInfo.location} ${errInfo.msg}`;
    err.status = 422;
  }

  res.status(err.status || 500);

  // si el fallo es en el API
  // responder en formato JSON
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;
