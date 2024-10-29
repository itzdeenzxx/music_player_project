import express from "express"
import * as favC from "../controllers/favController.js"    
const router = express.Router()
router.get('/favs/chkcart',favC.chkFavorites)
router.post('/favs/addcart',favC.postFavorites)
// router.post('/favs/addcartdtl',favC.postCartDtl)
// router.get('/favs/sumcart',favC.sumCart)
router.get('/favs/getcart/:id',favC.getFavorites)
router.get('/favs/getcartdtl/:id',favC.deleteFavorite)
// router.post('/favs/getcartbycus',favC.getCartByCus)

export default router