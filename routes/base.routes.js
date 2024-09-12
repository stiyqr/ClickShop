const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/home');
});

router.get('/401', function (req, res) {
    res.status(401).render('shared/401');
});

router.get('/403', function (req, res) {
    res.status(403).render('shared/403');
});

router.get('/getLang', function (req, res) {
    const lang = res.locals.lang;

    res.json({
        message: 'Retrieved language!',
        langData: {
            lang: lang
        },
    });
})

router.patch('/setLang', function (req, res) {
    req.session.lang = req.body.lang;

    res.json({ message: 'Language set!' });
});

module.exports = router;
