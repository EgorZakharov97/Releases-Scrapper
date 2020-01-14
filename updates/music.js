const cheerio = require('cheerio')
const Movie = require('../models/movie')
const downloadPage = require('./scrapper').downloadPage
const saveGame = require('./scrapper').saveItem

const URL = "https://en.wikipedia.org/wiki/List_of_2019_albums"
const prefix = "https://en.wikipedia.org/"

function upgradeMusic(){
    return new Promise(function(resolve, reject){
        let release = {}
        try {
            const html = downloadPage(URL)
            const $ = cheerio.load(html)
            this.date = "Comming soon"

            $(".wikitable").each((i, table) => {
                table = $(table).find('tbody > tr:not(:first-child)')
                $(table).each((j, row) => {

                    if(row.children.length == 12) {
                        let sanitizer = $(row).find('td:first-child')
                        this.date = sanitizer.text().trim()
                        row = $(row).remove(sanitizer)
                    }

                    let tds = $(row).find('td')

                    let link = $(tds[1]).find('a').attr('href')
                    
                    if(link){
                        // release = getReleaseFromLink(prefix + link)
                    }

                    release.author = $(tds[0]).text().trim()
                    release.album = $(tds[1]).text().trim()
                    release.genre = $(tds[2]).text().trim()
                    release.label = $(tds[3]).text().trim()
                    release.date = this.date

                    console.log(release)
                    resolve(release)
                })
            })
        }
        catch(e) {
            reject(e)
        }
        
    })
}

function getReleaseFromLink(url) {
    let release = {}
    const html = downloadPage(url)
    // let $ = cheerio.load(html)

        // try {
        //     release.album = getAlbum($)
        //     release.desc = $(html).find('#mw-content-text > .mw-parser-output > p').text()
        // }
        // catch{}

    return release
}

function getAlbum($) {
    try{
        let album = []
        
        $('body').find('.tracklist > tbody > tr:not(:first-child)').each((i, row) => {
            let col = $(row).find('td')
            let song = {}
            song.no = $(col[0]).text().trim()
            song.name = $(col[1]).text().trim()
            song.length = $(col[2]).text().trim()
            album.push(song)
        })

        album.pop(album.length - 1)
        return album
    }
    catch(e){
        throw "Has no data"
    }
}

upgradeMusic()

// /wiki/She_Is_Miley_Cyrus
// /wiki/High_Expectations