const mongoose = require('mongoose')

const User = mongoose.model('User')

exports.edit = (req, res) => {
    res.render('account', { title: 'Edit Your Account' })
}

exports.update = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findOneAndUpdate({
        _id: req.user.id
    }, {
        $set: updates
    }, {
        new: true, //return new store instead of old one
        runValidators: true,
        context: 'query'
    })

    req.flash('success', 'Account updated successfully.')
    res.redirect('back')
}