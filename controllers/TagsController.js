const mongoose = require('mongoose')
const Store = mongoose.model('Store')

exports.index = async (req, res) => {
    const currentTag = req.params.tag
    const tagsPromise = Store.getTagsList()
    const storesPromise = Store.find({ tags: currentTag || { $exists: true } })

    const [tags, stores] = await Promise.all([tagsPromise, storesPromise])

    res.render('tags', {
        currentTag,
        tags,
        stores,
        title: 'Tags'
    })
}