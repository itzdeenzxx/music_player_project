import express from "express"
import * as favC from "../controllers/favController.js"    
const router = express.Router()
router.get('/favs/chkcart',favC.chkCart)
router.post('/favs/addcart',favC.postCart)
router.post('/favs/addcartdtl',favC.postCartDtl)
router.get('/favs/sumcart',favC.sumCart)
router.get('/favs/getcart/:id',favC.getCart)
router.get('/favs/getcartdtl/:id',favC.getCartDtl)
router.post('/favs/getcartbycus',favC.getCartByCus)

export default router