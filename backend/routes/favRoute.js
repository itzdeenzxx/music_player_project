import express from "express"
import * as favC from "../controllers/favController.js"    
const router = express.Router()

router.get('/favs/chkfavs', favC.chkFavorites)
router.post('/favs/addfavs', favC.postFavorites)
router.get('/favs/getfavs/:id', favC.getFavorites)
router.get('/favs/getfavsdtl/:id', favC.deleteFavorite)
// Fix: Remove space from route path
router.post('/favs/getfavsbyuser', favC.getFavByUser)  // Changed from 'getfavs byuser' to 'getfavsbyuser'

export default router