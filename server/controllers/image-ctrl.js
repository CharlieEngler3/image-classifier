const {Image} = require('../models/image-model')
const {CustomFile} = require('../models/image-model')

createImage = (req, res) => {
    const body = req.body

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'Please provide a image',
        })
    }

    const image = new Image(body)

    if(!image){
        return res.status(400).json({ success: false, error: err })
    }

    image
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: image._id,
                message: 'Image added!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Image was not added!',
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

updateImage = async(req, res) => {
    const body = req.body
    let oldName

    if(!body){
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    await Image.findOne({ _id: req.params.id }, (err, image) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'Image not found!',
            })
        }
        oldName = image.name

        image.name = body.name
        image.lowerName = body.name.toLowerCase()
        image.description = body.description
        image.save().then(() => {
            updateFile(oldName, body)

            return res.status(200).json({
                success: true,
                id: image._id,
                message: 'Image updated!',
            })
        }).catch(error => {
            return res.status(404).json({
                message: 'Image not updated!',
            })
        })
    })
}

updateFile = async(fileName, body) => {
    await CustomFile.find({ name: fileName }, (err, imageFiles) => {
        if(err){
            return res.status(404).json({
                err,
                message: 'File not found!',
            })
        }

        for(let i = 0; i < imageFiles.length; i++){
            imageFiles[i].name = body.name
            imageFiles[i].lowerName = body.name.toLowerCase()
            imageFiles[i].save()
        }
    })
}

searchImage = async(req, res) => {
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
        await Image.find({ lowerName: {$regex: '.*' + searchName + '.*'} }, (err, image) => {
            if(err){
                console.log("Search Error", err)
                return
            }
    
            let images = []
    
            for(let i = 0; i < image.length; i++){
                images.push(image[i])
            }
    
            return res.status(200).json({
                success: true,
                data: images,
            })
        }).catch(err => console.log(err))
    }
    else{
        await Image.find({ lowerName: searchName }, (err, image) => {
            if(err){
                console.log("Search Error", err)
                return
            }
    
            let images = []
    
            for(let i = 0; i < image.length; i++){
                images.push(image[i])
            }
    
            return res.status(200).json({
                success: true,
                data: images,
            })
        }).catch(err => console.log(err))
    }
}

deleteImage = async(req, res) => {
    await Image.findOneAndDelete({ _id: req.params.id }, (err, image) => {
        if(err){
            return res.status(400).json({ success: false, error: err })
        }

        if(!image){
            return res
                .status(404)
                .json({ success: false, error: `Image not found` })
        }

        CustomFile.deleteMany({ name: req.params.name }).catch(err => console.log(err))

        return res.status(200).json({ success: true, data: image })
    }).catch(err => console.log(err))
}

getImageById = async(req, res) => {
    await Image.findOne({ _id: req.params.id }, (err, image) => {
        if(err){
            return res.status(400).json({ success: false, error: err})
        }

        if(!image){
            return res
                .status(404)
                .json({ success: false, error: `Image not found` })
        }
        return res.status(200).json({ success: true, data: image })
    }).catch(err => console.log(err))
}

getImages = async(req, res) => {
    await Image.find({}, (err, images) => {
        if(err){
            return res.status(400).json({ success: false, error: err })
        }
        if(!images.length){
            return res.status(200).json({ success: true, data: [] })
        }
        return res.status(200).json({ success: true, data: images })
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
    createImage,
    saveFile,
    updateImage,
    searchImage,
    deleteImage,
    getImages,
    getFiles,
    getImageById,
}