const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            username: '',
            phone: '',
            password: '',
            confirmPassword: '',
        };
    }

    res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
    const enteredData = {
        username: req.body.username,
        phone: req.body.phone,
        password: req.body.password,
        confirmPassword: req.body['confirm-password'],
    };

    if (
        !validation.userDetailsAreValid(
            req.body.username,
            req.body.password,
            req.body.phone
        ) ||
        !validation.passwordIsConfirmed(req.body.password, req.body['confirm-password'])
    ) {
        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage:
                    'Please check your input. Username and password must be at least 4 characters long.',
                ...enteredData,
            },
            function () {
                res.redirect('/signup');
            }
        );
        return;
    }

    const user = new User(
        req.body.username,
        req.body.password,
        req.body.phone
    );

    try {
        // check if user signs up with an existing email account
        const existAlready = await user.existAlready();

        if (existAlready) {
            sessionFlash.flashDataToSession(
                req,
                {
                    errorMessage:
                        'User exists already! Try logging in instead!',
                    ...enteredData,
                },
                function () {
                    res.redirect('/signup');
                }
            );
            return;
        }

        // sign up new user if credentials are valid and user not already exist
        await user.signup();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/login');
}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            username: '',
            password: '',
        };
    }

    res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
    const user = new User(req.body.username, req.body.password);
    let existingUser;
    try {
        existingUser = await user.getUserWithSameUsername();
    } catch (error) {
        next(error);
        return;
    }

    const sessionErrorData = {
        errorMessage:
            'Invalid credentials - please double-check your username and password!',
        email: user.username,
        password: user.password,
    };

    if (!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect('/login');
        });
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(
        existingUser.password
    );

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect('/login');
        });
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout,
};
