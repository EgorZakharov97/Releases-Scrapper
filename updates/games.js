
const request = require('request')
const cheerio = require('cheerio')
const Game = require('../models/game')
const downloadPage = require('./scrapper').downloadPage
const saveGame = require('./scrapper').saveItem

const URL = "https://www.gameinformer.com"
let hrefs = []

async function updateGames(){
    console.log("-----------------")
    console.log("UPDATING GAMES...")
    console.log("-----------------")

    let html, links
    let count = 0
    let countExt = 0

    try {
        html = await downloadPage(URL + '/2019')
        links = grabLinks(html)

        for(let i = 0; i < links.length && countExt <= 20; i++) {
            let innerHTML = await downloadPage(links[i])
            let game = constructGame(innerHTML)
            let saved = await saveGame(Game, {title: game.title}, game)

            if (saved){
                countExt = 0
                count++
                console.log('game added')
            } else {
                countExt++
                console.log('game already exists')
            }
        }

        console.log(count + " games added")
    }
    catch(e) {
        console.log("Error: " + e)
    }
}

function grabLinks(html) {
    let links = []
    const $ = cheerio.load(html)
    const body = $('.clearfix.text-formatted.field')

    $(body).find('.calendar_entry').each((j, entry) => {
        links.push(URL + $(entry).find('a').attr('href'))
    })
    return links
}

function constructGame(html) {
    let game = {}
    let developers = ''
    const $ = cheerio.load(html)
    const body = $('.blurred-header-content')
    const info = $(body).find('.game-info')

    game.img = $(body).find('img').attr('src')
    game.title = $(body).find('.field--name-title').text()
    game.platform = retreiveInfo($, info, '.views-field.views-field-nothing')
    game.numPlayers = retreiveInfo($, info, '.field--name-field-product-numberofplayers')
    game.developer = retreiveInfo($, info, '.field--name-field-product-developer')
    game.publisher = retreiveInfo($, info, '.field--name-field-product-publisher')
    game.genre = retreiveInfo($, info, '.field--name-field-product-genre')
    game.release = retreiveInfo($, info, '.field--name-field-product-releasedate')
    game.raiting = retreiveInfo($, info, '.field--name-field-product-industryrating')

    return game
}

function retreiveInfo($, field, className) {
    let found = $(field).find(className)
    let response = ''
    $(found).find('.field__item').each((i, item) => {
        response += $(item).text() + ", "
    })
    response = response.trim().substring(0, response.length - 2)
    response = response.replace('\n', '')
    return response
}

module.exports = updateGames