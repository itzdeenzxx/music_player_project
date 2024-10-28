import database from "../service/database.js";
import bcrypt from "bcrypt"
import multer from "multer"

// upload part
// กำหนดตำแหน่งที่จะเก็บ file ที่ upload --> img_mem
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_mem')
    },
    // กำหนดชื่อ file
    filename: function (req, file, cb) {
        const filename = `${req.session.memEmail}.jpg`
        cb(null, filename)
    }
})
// จำกัดประเภทของไฟล์ที่อัปโหลด
const upload = multer({
    storage: storage,
}).single('file');

export async function postMember(req, res) {
    console.log(`Post /Member is request `)
    const bodyDate = req.body
    try {
        if (req.body.memEmail == null || req.body.memName == null) {
            console.log("Fail1")
            return res.json({messageregister: 'fail' })
        }

        const existsResult = await database.query({
            text: `Select exists (SELECT * FROM members WHERE "memEmail"= $1)`,
            values: [req.body.memEmail]
        })
        if (existsResult.rows[0].exists) {
            console.log("Fail2")
            return res.json({messageregister: 'fail' })
        }

        const thePwd = req.body.password
        const saltround = 11 //จำนวนรอบของ salt ยิ่งมากยิ่งช้า
        const pwdHash = await bcrypt.hash(thePwd,saltround)
        const result = await database.query({
            text: `Insert Into members ("memEmail","memName","memHash")
            VALUES ($1,$2,$3)`,
            values: [
                req.body.memEmail,//$1
                req.body.memName,//$2
                pwdHash, //$3
            ]
        })
        // build simple dateTime return to Client 
        // const datetime = new Date()
        // bodyDate.createDate = datetime
        // res.status(201).json(bodyDate)
        console.log("OK")
        return res.json({messageregister: 'success' })
    } catch (err) {
        console.log("Fail3")
        return res.json({messageregister: 'fail' })
    }

}

export async function LoginMember(req, res) {
    console.log(`Post /LoginMember is request `)
    const bodyData = req.body
    try {
        console.log(req.body)
        if (req.body.loginname == null || req.body.password == null) {
            return res.json({messagelogin:'fail'})
        }

        const existsResult = await database.query({
            text: `Select exists (SELECT * FROM members m WHERE m."memEmail"= $1)`,
            values: [req.body.loginname]
        })
        if (!existsResult.rows[0].exists) {
            console.log("FAIL1")
            return res.json({messagelogin:'fail'})
        }

        // const thePwd = req.body.password
        // const saltround = 11 //จำนวนรอบของ salt ยิ่งมากยิ่งช้า
        // const pwdHash = await bcrypt.hash(thePwd,saltround)
        const result = await database.query({
            text: `SELECT * FROM members m WHERE m."memEmail"=$1`,
            values: [
                req.body.loginname
            ]
        })
        // build simple dateTime return to Client 
        // const datetime = new Date()
        // bodyDate.createDate = datetime
        // res.status(201).json(bodyDate)
        const loginok = await bcrypt.compare(req.body.password,result.rows[0].memHash)
        if(loginok){
            req.session.memEmail=result.rows[0].memEmail
            req.session.memName=result.rows[0].memName
            req.session.dutyId=result.rows[0].dutyId
            console.log(req.session)
            res.status(201).json({messagelogin:'success'})
        }
        else{
            console.log("FAIL2")
            res.status(400).json({messagelogin:'fail'})
        }
    } catch (err) {
        console.log("FAIL3")
        return res.json({messagelogin:'fail'})
    }

}
export async function getSession(req,res) {
    console.log(`Get /getSession is requested`)
    console.log(req.session)
    const thedata={
        email:req.session.memEmail,
        name:req.session.memName,
        duty:req.session.dutyId
    }
    console.log(thedata)
    return res.json(thedata)
}
export async function logoutMember(req,res){
    console.log(`GET /logoutMembers is requested`)
    try{
        // ลบเฉพาะ key ที่ระบุ
        // delete req.session.someKey;
        // ล้าง Session ทั้งหมด
        req.session.destroy()
        // ลบ Cookie ด้วย
        res.clearCookie('connect.sid')
        return res.status(200).json({messagelogout:'success'})
    }catch(err)
    {
        return res.status(500).json({messagelogout:'fail'})
    }
}
export async function uploadMember(req, res) {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(200).json({ message: 'File uploaded successfully!' });
    });
}

