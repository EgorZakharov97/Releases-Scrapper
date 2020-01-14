
const request = require('request')

module.exports = {
    downloadPage: function(url) {
        return new Promise((resolve, reject) => {
            request(url, (err, res, html) => {
                if(!err && res.statusCode == 200){
                    resolve(html)
                } else {
                    reject("Could not connect to " + url + "\n")
                }
            })
        })
    },
    saveItem: async function(Item, term, obj) {
        let found = await Item.find(term)

        if((Object.entries(found).length) <= 0){
            Item.create(obj)
            return true
        } else {
            return false
        }
    }
}