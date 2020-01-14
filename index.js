'use strict'
const MovieUpdater = require('./updates/movies').MovieUpdater
const updateGames = require('./updates/games')
const mongoose = require('mongoose')


mongoose.connect("mongodb://localhost/scrapper", {useNewUrlParser: true})

updateGames()


