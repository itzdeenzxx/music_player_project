import express from "express"
// ตรง{}คือการimport getAllmember
import * as memberC from "../controllers/memberController.js"

const router =express.Router()
router.get('/members/logout',memberC.logoutMember)
router.get('/members/getss',memberC.getSession)
router.post('/members',memberC.postMember)
router.post('/members/login',memberC.LoginMember)
router.post('/members/uploadImg',memberC.uploadMember)

export default router