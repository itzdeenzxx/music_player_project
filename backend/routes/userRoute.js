import express from "express"
// ตรง{}คือการimport getAllmember
import * as userC from "../controllers/userController.js"

const router =express.Router()
router.get('/users/logout',userC.logoutMember)
router.get('/users/getss',userC.getSession)
router.post('/users',userC.postMember)
router.post('/users/login',userC.LoginMember)
router.post('/users/uploadImg',userC.uploadMember)

export default router