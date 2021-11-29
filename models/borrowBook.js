const mongoose = require('mongoose');
const schema = mongoose.Schema
const borrowSchema =new schema({
    book: {
        type: String,
        require:true
    },
    user:{
        type: String,
        require:true
    },
    score: {
        type: Number
    },

},
{timestamp: true})

const borrowBook = mongoose.model('borrowBook',borrowSchema)
module.exports = borrowBook