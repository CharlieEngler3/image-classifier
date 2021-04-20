const express = require('express')

const MemeCtrl = require('../controllers/meme-ctrl')

const router = express.Router()

router.post('/meme', MemeCtrl.createMeme)
router.put('/meme/update/:id', MemeCtrl.updateMeme)
router.post('/meme/search/:term', MemeCtrl.searchMeme)
router.delete('/meme/:id', MemeCtrl.deleteMeme)
router.get('/meme/:id', MemeCtrl.getMemeById)
router.get('/memes', MemeCtrl.getMemes)

module.exports = router