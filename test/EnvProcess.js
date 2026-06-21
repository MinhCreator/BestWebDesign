import "dotenv/config"

const test = {
    host: process.env.HOST,
    user: process.env.USER
}

console.log(test)