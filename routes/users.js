var express = require('express');
var router = express.Router();
const utils = require('../lib/utils');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    await utils.sleep(2000)
    res.send('respond with a resource');
  } catch (error) {
    next(error)
  }
});

module.exports = router;
