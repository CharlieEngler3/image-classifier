const express = require('express')

const ImageCtrl = require('../controllers/image-ctrl')

const router = express.Router()

router.post('/image', ImageCtrl.createImage)
router.post('/file', ImageCtrl.saveFile)
router.put('/image/update/:id', ImageCtrl.updateImage)
router.post('/image/search/:term/:mode', ImageCtrl.searchImage)
router.delete('/image/:id/:name', ImageCtrl.deleteImage)
router.get('/image/:id', ImageCtrl.getImageById)
router.get('/images', ImageCtrl.getImages)
router.get('/files', ImageCtrl.getFiles)

module.exports = router