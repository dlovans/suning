const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    key: {
        type: String
    },
    localizedName: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    latitude: {
        type: 'Number'
    },
    longitude: {
        type: 'Number'
    }
})

module.exports = mongoose.model('Location', locationSchema)