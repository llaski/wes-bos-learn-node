const mongoose = require('mongoose')
const promisify = require('es6-promisify')

const User = mongoose.model('User')

exports.loginForm = (req, res) => {
    res.render('auth/login', { title: 'Login' })
}

exports.registerForm = (req, res) => {
    res.render('auth/register', { title: 'Register' })
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name')
    req.checkBody('name', 'You must supply a name').notEmpty()
    req.checkBody('email', 'That email is not valid').isEmail()
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    })
    req.checkBody('password', 'You must supply a password').notEmpty()
    req.checkBody('confirm_password', 'You must supply a confirm password').notEmpty()
    req.checkBody('confirm_password', 'Oops! Your passwords do not match.').equals(req.body.password)

    const errors = req.validationErrors()

    if (errors) {
        req.flash('error', errors.map(err => err.msg))
        res.render('auth/register', { title: 'Register', body: req.body, flashes: req.flash() })
        return
    }

    next()
}

exports.register = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    })
    const register = promisify(User.register, User)
    await register(user, req.body.password)

    res.render('auth/register', { title: 'Register' })
}