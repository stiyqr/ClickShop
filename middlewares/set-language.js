function initializeLang(req, res, next) {
    let lang;

    if (!req.session.lang) {
        lang = 'en';
    }
    else {
        lang = req.session.lang;
    }

    res.locals.lang = lang;

    next();
}

module.exports = initializeLang;