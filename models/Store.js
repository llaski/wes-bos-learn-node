const mongoose = require('mongoose')
const slugs = require('slugs')
mongoose.Promise = global.Promise

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [{
            type: Number,
            required: 'You must supply coordinates.'
        }],
        address: {
            type: String,
            required: 'You must supply an address'
        }
    },
    photo: String
})

schema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        next()
        return
    }

    this.slug = slugs(this.name)

    const slugRegex = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
    const storesWithSlug = await this.constructor.find({ slug: slugRegex })

    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`
    }

    next()
})

schema.statics.getTagsList = function getTagsList() {
    return this.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: '$tags', count: { $sum: 1 }}},
        { $sort: { count: -1 }}
    ])
}

module.exports = mongoose.model('Store', schema)