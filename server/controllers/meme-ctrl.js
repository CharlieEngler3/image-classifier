const Meme = require('../models/meme-model')

createMeme = (req, res) => {
    const body = req.body

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'Please provide a meme',
        })
    }

    const meme = new Meme(body)

    if(!meme){
        return res.status(400).json({ success: false, error: err })
    }

    meme
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: meme._id,
                message: 'Meme added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Meme was not added!',
            })
        })
}

updateMeme = async(req, res) => {
    const body = req.body

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Meme.findOne({ _id: req.params.id }, (err, meme) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'Meme not found!',
            })
        }
        meme.name = body.name
        meme.description = body.description
        meme.filename = body.filename
        meme.file = body.file
        meme.save().then(() => {
                return res.status(200).json({
                    success: true,
                    id: meme._id,
                    message: 'Meme updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Meme not updated!',
                })
            })
    })
}

searchMeme = async(req, res) => {
    const body = req.body

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to search',
        })
    }

    const searchName = req.params.term.toString().toLowerCase()

    await Meme.find({ lowerName: {$regex: '.*' + searchName + '.*'} }, (err, meme) => {
        if(err){
            console.log("Search Error", err)
            return
        }

        let memes = []

        for(let i = 0; i < meme.length; i++){
            memes.push(meme[i])
        }

        return res.status(200).json({
            success: true,
            data: memes,
        })
    }).catch(err => console.log(err))
}

deleteMeme = async(req, res) => {
    await Meme.findOneAndDelete({ _id: req.params.id }, (err, meme) => {
        if(err){
            return res.status(400).json({ success: false, error: err })
        }

        if(!meme){
            return res
                .status(404)
                .json({ success: false, error: `Meme not found` })
        }

        return res.status(200).json({ success: true, data: meme })
    }).catch(err => console.log(err))
}

getMemeById = async(req, res) => {
    await Meme.findOne({ _id: req.params.id }, (err, meme) => {
        if(err){
            return res.status(400).json({ success: false, error: err})
        }

        if(!meme){
            return res
                .status(404)
                .json({ success: false, error: `Meme not found` })
        }
        return res.status(200).json({ success: true, data: meme })
    }).catch(err => console.log(err))
}

getMemes = async(req, res) => {
    await Meme.find({}, (err, memes) => {
        if(err){
            return res.status(400).json({ success: false, error: err })
        }
        if(!memes.length){
            return res
                .status(404)
                .json({ success: false, error: `Meme not found` })
        }
        return res.status(200).json({ success: true, data: memes })
    }).catch(err => console.log(err))
}

module.exports = {
    createMeme,
    updateMeme,
    searchMeme,
    deleteMeme,
    getMemes,
    getMemeById,
}