const mongoose = require('mongoose')

//MOVIE
var MovieSchema = new mongoose.Schema({
    title: String,
    genre: String,
    date: String,
    author: String,
    mark: Number,
    length: String,
    shortDesc: String,
    img: String
})

module.exports = mongoose.model("Movie", MovieSchema)