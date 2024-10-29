import express from "express"
// ตรง{}คือการimport getAllProduct
import *as musicC from "../controllers/musicController.js"

const router =express.Router()
router.get('/musics',musicC.getAllMusics)
// router.get('/musics/ten',musicC.getTenProduct)
router.get('/musics/:id',musicC.getMusicById)
router.get('/musics/search/:name', musicC.getSearchMusic)
router.post('/musics',musicC.postMusic)
router.put('/musics/:id',musicC.putMusic)
router.delete('/musics/:id',musicC.deleteMusic)
// router.get('/musics/brands/:id',musicC.getProductByBrandId)

export default router