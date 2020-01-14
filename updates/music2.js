const cheerio = require('cheerio')
const Movie = require('../models/movie')
const downloadPage = require('./scrapper').downloadPage
const saveGame = require('./scrapper').saveItem

const URL = "https://en.wikipedia.org/wiki/List_of_2019_albums"
const prefix = "https://en.wikipedia.org/"

function upgradeMusic(){
    return new Promise (async (resolve, reject) => {
        let html = await downloadPage(URL).catch((e) => { reject(e) })
        const $ = cheerio.load(html)
        this.date = "Comming soon"
        let news = []
        let links = []

        $(".wikitable").each((i, table) => {
            table = $(table).find('tbody > tr:not(:first-child)')
            $(table).each((j, row) => {
                let release = {}
                if(row.children.length == 12) {
                    let sanitizer = $(row).find('td:first-child')
                    this.date = sanitizer.text().trim()
                    row = $(row).remove(sanitizer)
                }

                let tds = $(row).find('td')

                let link = $(tds[1]).find('a').attr('href')
                
                if(link){
                    let newHTML = await downloadPage(prefix + link)
                    release = await getReleaseFromLink(newHTML)
                    links.push(link)
                }
                release.author = $(tds[0]).text().trim()
                release.album = $(tds[1]).text().trim()
                release.genre = $(tds[2]).text().trim()
                release.label = $(tds[3]).text().trim()
                release.date = this.date

                

                news.push(release)
            })
        })

        resolve(news)
        
    })
}

function getReleaseFromLink(html) {
    return new Promise((resolve, reject) => {
        let $ = cheerio.load(html)
        let release = {}
        
        let album = getAlbum($)
        if(album) release.album = album
        
        release.desc = $(html).find('#mw-content-text > .mw-parser-output > p').text()
        resolve(result)
    })
}

function getAlbum($) {
    let album
    try{
        album = []
        $('body').find('.tracklist > tbody > tr:not(:first-child)').each((i, row) => {
            let col = $(row).find('td')
            let song = {}
            song.no = $(col[0]).text().trim()
            song.name = $(col[1]).text().trim()
            song.length = $(col[2]).text().trim()
            album.push(song)
        })

        album.pop(album.length - 1)
    }
    catch(e){
    }
    finally {
        return album
    }
}

upgradeMusic().then((news) => {
    console.log(news)
}).catch((e) => {
    console.log(e)
})