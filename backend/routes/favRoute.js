import express from "express"
import * as favC from "../controllers/favController.js"    
const router = express.Router()
router.get('/favs/chkfavs',favC.chkFavorites)
router.post('/favs/addfavs',favC.postFavorites)
// router.post('/favs/addcartdtl',favC.postCartDtl)
// router.get('/favs/sumcart',favC.sumCart)
router.get('/favs/getfavs/:id',favC.getFavorites)
router.get('/favs/getfavsdtl/:id',favC.deleteFavorite)
router.post('/favs/getfavs byuser',favC.getFavByUser)

export default router