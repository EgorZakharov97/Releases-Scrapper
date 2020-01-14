Array.prototype.asyncForEach = async function(callback) {
    await this.forEach(el => {
        callback(el)
    })
}

let a = [1, 2, 3, 4, 5]


async function func() {
    await a.forEach(el => {
        console.log(el)
    })
}

func()

console.log('done')