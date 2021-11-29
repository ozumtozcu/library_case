
const mongoose = require('mongoose');
const schema = mongoose.Schema
const bookSchema =new schema({
    title: {
        type: String,
        require:true
    },
    bookId: {
        type: String,
        require:true
    }
})

const book = mongoose.model('book',bookSchema)
module.exports = book