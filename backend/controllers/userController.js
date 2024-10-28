import database from "../service/database.js";
import bcrypt from "bcrypt";
import multer from "multer";

// Upload Part
// กำหนดตำแหน่งที่จะเก็บไฟล์ที่ upload --> img_mem
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_mem');
    },
    // กำหนดชื่อไฟล์
    filename: function (req, file, cb) {
        const filename = `${req.session.userEmail}.jpg`;
        cb(null, filename);
    }
});

// จำกัดประเภทของไฟล์ที่อัปโหลด
const upload = multer({
    storage: storage,
}).single('file');

export async function postUser(req, res) {
    console.log(`Post /User is requested`);
    const bodyData = req.body;
    try {
        if (!req.body.userEmail || !req.body.userName) {
            console.log("Fail1");
            return res.json({ messageregister: 'fail need user' });
        }

        const existsResult = await database.query({
            text: `SELECT EXISTS (SELECT 1 FROM Users WHERE user_email = $1)`,
            values: [req.body.userEmail]
        });
        if (existsResult.rows[0].exists) {
            console.log("Fail2");
            return res.json({ messageregister: 'fail' });
        }

        const thePwd = req.body.password;
        const saltround = 11; // จำนวนรอบของ salt ยิ่งมากยิ่งช้า
        const pwdHash = await bcrypt.hash(thePwd, saltround);
        await database.query({
            text: `INSERT INTO Users (user_name, user_hash, user_email, user_dutyId) 
                   VALUES ($1, $2, $3, $4)`,
            values: [
                req.body.userName, //$1
                pwdHash,          //$2
                req.body.userEmail, //$3
                req.body.userDutyId //$4
            ]
        });

        console.log("OK");
        return res.json({ messageregister: 'success' });
    } catch (err) {
        console.log("Fail3");
        return res.json({ messageregister: 'fail' });
    }
}

export async function loginUser(req, res) {
    console.log(`Post /LoginUser is requested`);
    const bodyData = req.body;
    try {
        if (!req.body.loginname || !req.body.password) {
            return res.json({ messagelogin: 'fail' });
        }

        const result = await database.query({
            text: `SELECT * FROM Users WHERE user_email = $1`,
            values: [req.body.loginname]
        });

        if (result.rows.length === 0) {
            console.log("FAIL1");
            return res.json({ messagelogin: 'fail' });
        }

        const loginOk = await bcrypt.compare(req.body.password, result.rows[0].user_hash);
        if (loginOk) {
            req.session.userEmail = result.rows[0].user_email;
            req.session.userName = result.rows[0].user_name;
            req.session.dutyId = result.rows[0].user_dutyId;
            console.log(req.session);
            res.status(201).json({ messagelogin: 'success' });
        } else {
            console.log("FAIL2");
            res.status(400).json({ messagelogin: 'fail' });
        }
    } catch (err) {
        console.log("FAIL3");
        return res.json({ messagelogin: 'fail' });
    }
}

export async function getSession(req, res) {
    console.log(`Get /getSession is requested`);
    console.log(req.session);
    const thedata = {
        email: req.session.userEmail,
        name: req.session.userName,
        duty: req.session.dutyId
    };
    console.log(thedata);
    return res.json(thedata);
}

export async function logoutUser(req, res) {
    console.log(`GET /logoutUser is requested`);
    try {
        req.session.destroy(); // ล้าง Session ทั้งหมด
        res.clearCookie('connect.sid'); // ลบ Cookie ด้วย
        return res.status(200).json({ messagelogout: 'success' });
    } catch (err) {
        return res.status(500).json({ messagelogout: 'fail' });
    }
}

export async function uploadUser(req, res) {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(200).json({ message: 'File uploaded successfully!' });
    });
}
