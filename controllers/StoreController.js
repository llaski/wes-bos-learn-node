const mongoose = require('mongoose')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const Store = mongoose.model('Store')
const multerOptions = {
    storage: multer.memoryStorage(),
    filterFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWidth('image/')

        if (isPhoto) {
            next(null, true)
        } else {
            next({ message: `That file type isn't allowed`}, false)
        }
    }
}

exports.index = async (req, res) => {
    const stores = await Store.find()
    res.render('stores', { title: 'Stores', stores })
}

exports.add = (req, res) => {
    res.render('editStore', {
        title: 'Add Store'
    })
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
    if (!req.file) {
        return next()
    }

    const extension = req.file.mimetype.split('/')[1]
    req.body.photo = `${uuid.v4()}.${extension}`
    const photo = await jimp.read(req.file.buffer)
    await photo.resize(800, jimp.AUTO)
    await photo.write(`./public/uploads/${req.body.photo}`)

    next()
}

exports.store = async (req, res) => {
    const store = await (new Store(req.body)).save()

    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
    res.redirect(`/store/${store.slug}`)
}

exports.edit = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id })

    res.render('editStore', {
        title: 'Edit Store',
        store
    })
}

exports.update = async (req, res) => {
    req.body.location.type = 'Point'

    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //return new store instead of old one
        runValidators: true,
    }).exec()

    req.flash('success', `Successfully created <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`)
    res.redirect(`/stores/${store._id}/edit`)
}

exports.show = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug })

    if (!store) {
        return next()
    }

    res.render('showStore', {
        title: store.name,
        store
    })
}