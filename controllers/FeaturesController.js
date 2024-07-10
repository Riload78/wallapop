class FeaturesController {
  index(req, res, next) {
    res.render('features', { color: req.session.color });
  }
}

module.exports = FeaturesController