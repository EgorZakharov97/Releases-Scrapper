'use strict'

const request = require('request')
const cheerio = require('cheerio')
const Movie = require('../models/movie')
const fs = require('fs')

class MovieUpdater {

    constructor(){
        this.URL = "https://www.cinemaclock.com/movies/upcoming"
        this.prefix = "https://www.cinemaclock.com"
        this.count = 0
    }

    updateMovies() {

        console.log("------------------")
        console.log("UPDATING MOVIES...")
        console.log("------------------")

        request(this.URL, (err, res, html) => {
            if(!err && res.statusCode == 200){
                const $ = cheerio.load(html)
                this.count = 0

                $('.dateHD').each((i, dateBlock) => {
                    const date = $(dateBlock).find('.bull').text().trim()
                    $(dateBlock).find('.movieblock').each((j, movieblock) => {
                        let movie = {}
                        movie.date = date
                        movie.title = $(movieblock).find('.movietitle').text().trim()
                        movie.genre = $(movieblock).find('.moviegenre').text().trim()
                        movie.mark = $(movieblock).find('.valmain').text()
                        movie.img = this.prefix + $(movieblock).find('img').attr('data-src')
                
                        constructMovie.call(this, movie)
                    })
                })

            } else {
                console.log("Failes to connect the server to load movies!")
            }
        })
    }

    getCount() {
        console.log(this.count + " movies were lately added")
    }
}

// USED TO SPLIT A MOVIE DESCRIPTION INTO SEPARATE CONSTANTS
function splitGenre(movie) {
    let split = movie.genre.split('•')

    switch (split.length) {
        case 0:
            movie.shortDesc = split[0]
            break
        
        case 1:
            movie.shortDesc = split[0].trim()
            delete movie.genre
            break

        case 2:
            movie.genre = split[0].trim()
            movie.author = split[1].trim()
            break

        case 3:
            movie.length = split[0].trim()
            movie.genre = split[1].trim()
            movie.author = split[2].trim()
            break
    }
    return movie
}

// REDUCES ANNOING ENDINGS OF TITLES
function correctTitle(movie){
    if(movie.title.endsWith('PG')){
        movie.title = movie.title.substring(0, movie.title.length - 3)
    } else if (movie.title.endsWith('PG-13')){
        movie.title = movie.title.substring(0, movie.title.length - 6)
    } else if (movie.title.endsWith('R13+')){
        movie.title = movie.title.substring(0, movie.title.length - 5)
    } else if (movie.title.endsWith('PGG')){
        movie.title = movie.title.substring(0, movie.title.length - 4)
    } else if (movie.title.endsWith('PG-13G')){
        movie.title = movie.title.substring(0, movie.title.length - 7)
    } else if (movie.title.endsWith('R')){
        movie.title = movie.title.substring(0, movie.title.length - 2)
    }
    return movie
}

function saveMovie(movie){

}

// USED TO CREATE A UNIQUE OBJECT IN DATABASE
function constructMovie(movie){
    movie = splitGenre(movie)
    movie = correctTitle(movie)
    

    if(movie.mark != ''){
        movie.mark = parseInt(movie.mark)
    } else {
        delete movie.mark
    }

    Movie.find({title: movie.title}, function(err, found){
        if(err){
            console.log(err)
        } else {
            if(found){
                process.stdout.write('.');
            } else {
                Movie.create(movie)
            }
        }
    })
}

exports.MovieUpdater = MovieUpdater