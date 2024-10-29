import express from "express"

import * as userC from "../controllers/userController.js"

const router =express.Router()
router.get('/users/logout',userC.logoutUser)
router.get('/users/getss',userC.getSession)
router.post('/users',userC.postUser)
router.post('/users/login',userC.loginUser)
router.post('/users/uploadImg',userC.uploadUser)

export default router