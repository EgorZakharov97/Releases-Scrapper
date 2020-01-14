const request = require('request')
const cheerio = require('cheerio')
const Movie = require('../models/movie')

const URL = "https://www.cinemaclock.com/movies/upcoming"
const prefix = "https://www.cinemaclock.com"
let count = 0

// console.log("------------------")
// console.log("UPDATING MOVIES...")
// console.log("------------------")

async function updateMovies() {

}

let asyncForEach = async function(callback){
    console.log()
    await this.each(el => {
        callback(el)
    })
}

makeRequest().then(() => {console.log('then')}).catch((err) =>  {console.log(err)})

async function makeRequest() {
    return new Promise((resolve, reject) => {
        request(URL, (err, res, html) => {
            if(!err && res.statusCode == 200){
                const $ = cheerio.load(html)
                
                $.prototype.asyncForEach = asyncForEach
                $('dateHD').asyncForEach(movieblock => {
                    console.log(movieblock)
                })

                resolve()
            } else {
                reject(err)
            }
        })
    })
}

// async function makeRequest() {
//     request(this.URL, (err, res, html) => {
//         if(!err && res.statusCode == 200){
//             const $ = cheerio.load(html)
//             this.count = 0

//             $('.dateHD').each((i, dateBlock) => {
//                 const date = $(dateBlock).find('.bull').text().trim()
//                 $(dateBlock).find('.movieblock').each((j, movieblock) => {
//                     let movie = {}
//                     movie.date = date
//                     movie.title = $(movieblock).find('.movietitle').text().trim()
//                     movie.genre = $(movieblock).find('.moviegenre').text().trim()
//                     movie.mark = $(movieblock).find('.valmain').text()
//                     movie.img = this.prefix + $(movieblock).find('img').attr('data-src')
            
//                     constructMovie.call(this, movie)
//                 })
//             })

//         } else {
//             console.log("Failes to connect the server to load movies!")
//         }
//     })
// }

