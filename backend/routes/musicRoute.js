import express from "express"
// ตรง{}คือการimport getAllProduct
import *as musicC from "../controllers/musicController.js"

const router =express.Router()
router.get('/musics',musicC.getAllProduct)
router.get('/musics/ten',musicC.getTenProduct)
router.get('/musics/:id',musicC.getProductById)
router.get('/musics/search/:id', musicC.getSearchProduct)
router.post('/musics',musicC.postProduct)
router.put('/musics/:id',musicC.putProduct)
router.delete('/musics/:id',musicC.deleteProduct)
// router.get('/musics/brands/:id',musicC.getProductByBrandId)

export default router 