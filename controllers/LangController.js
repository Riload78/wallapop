class LangController {
  changeLocale(req, res, next) {
    const locale = req.params.locale

    // poner una cookie con el nuevo idioma
    res.cookie('nodeapp-locale', locale, {
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30 dias
    })

    // responder con la cookie y una redirección a la misma página de la que venía
    res.redirect('back')
  }
}

module.exports = LangController