const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Meme = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        filename: { type: String, required: true },
        file: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('memes', Meme)