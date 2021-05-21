const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MemeSchema = new Schema(
    {
        name: { type: String, required: true },
        lowerName: { type: String, required: true },
        description: { type: String, required: true },
        filename: { type: String, required: true },
        image: { type: String, required: true },
    },
    { timestamps: true },
)

const Meme = mongoose.model("memes", MemeSchema)

const CustomFileSchema = new Schema(
    {
        index: { type: Number, required: true },
        name: { type: String, required: true },
        lowerName: { type: String, required: true },
        file: { type: String, required: true },
    }
)

const CustomFile = mongoose.model("customFile", CustomFileSchema)

module.exports = {
    Meme: Meme,
    CustomFile: CustomFile
}