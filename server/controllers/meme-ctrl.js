const {Meme} = require('../models/meme-model')
const {CustomFile} = require('../models/meme-model')

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

saveFile = (req, res) => {
    const body = req.body

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'Please provide a file',
        })
    }

    const file = new CustomFile(body)

    if(!file){
        return res.status(400).json({ success: false, error: err })
    }

    file
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: file._id,
                message: 'File uploaded!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'File was not uploaded!',
            })
        })
}

updateMeme = async(req, res) => {
    const body = req.body
    let oldName

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await Meme.findOne({ _id: req.params.id }, (err, meme) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'Meme not found!',
            })
        }
        oldName = meme.name

        meme.name = body.name
        meme.lowerName = body.name.toLowerCase()
        meme.description = body.description
        meme.save().then(() => {
            updateFile(oldName, body)

            return res.status(200).json({
                success: true,
                id: meme._id,
                message: 'Meme updated!',
            })
        }).catch(error => {
            return res.status(404).json({
                message: 'Meme not updated!',
            })
        })
    })
}

updateFile = async(fileName, body) => {
    await CustomFile.find({ name: fileName }, (err, memeFiles) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'File not found!',
            })
        }

        for(let i = 0; i < memeFiles.length; i++){
            memeFiles[i].name = body.name
            memeFiles[i].lowerName = body.name.toLowerCase()
            memeFiles[i].save()
        }
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
    const exactSearch = req.params.mode

    if(!exactSearch){
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
    else{
        await Meme.find({ lowerName: searchName }, (err, meme) => {
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

        CustomFile.deleteMany({ name: req.params.name }).catch(err => console.log(err))

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

getFiles = async(req, res) => {
    await CustomFile.find({}, (err, files) => {
        if(err){
            return res.status(400).json({ success: false, error: err })
        }
        if(!files.length){
            return res
                .status(404)
                .json({ success: false, error: `File not found` })
        }
        return res.status(200).json({ success: true, data: files })
    }).catch(err => console.log(err))
}

module.exports = {
    createMeme,
    saveFile,
    updateMeme,
    searchMeme,
    deleteMeme,
    getMemes,
    getFiles,
    getMemeById,
}