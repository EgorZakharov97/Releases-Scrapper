const mongoose = require('mongoose')

//MOVIE
var GameSchema = new mongoose.Schema({
    title: String,
    platform: String,
    numPlayers: String,
    developer: String,
    publisher: String,
    genre: String,
    release: String,
    raiting: String,
    img: String
})

module.exports = mongoose.model("Game", GameSchema)