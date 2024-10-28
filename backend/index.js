import express from "express"
import pkg from "pg"
import database from "./service/database.js"
import dotenv from 'dotenv'
import bodyParser from "body-parser"
import productRoute from "./routes/musicRoute.js"
import memberRoute from "./routes/userRoute.js"
import cors from "cors"
import axios from "axios"
import session from "express-session"
import cartRoute from "./routes/favRoute.js"
// import ส่วนที่ติดตั้งเข้ามา
import swaggerUI from "swagger-ui-express"
import yaml from "yaml"
// ใช้ File
import fs from "fs"

const { Pool } = pkg
dotenv.config()

const app = express()
//const port = 3000
const port = process.env.port

// const database = new Pool({
//     connectionString:`postgres://dev:${encodeURIComponent('1234')}@127.0.0.1:5432/KuShop`
// })
app.use(bodyParser.json())
app.use("/img_pd",express.static("img_pd"))
app.use("/img_mem",express.static("img_mem"))

const thesecret = process.env.secret

app.use(cors({    origin:['http://localhost','http://localhost:8080','http://127.0.0.1:8080'],
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true
}))


app.use(session({
    secret: thesecret,
    resave: false,
    saveUninitialized: true
}))

app.use(productRoute)
// app.post('/products', async (req, res) => {
//     console.log(`Post /products is request `)
//     const bodyDate = req.body
//     try {
//         if (req.body.pd_id == null || req.body.pd_name == null) {
//             return res.status(422).json({ error: 'pd_id and pd_name is required' })
//         }

//         const existsResult = await database.query({
//             text: `Select exists (SELECT * FROM products WHERE "pd_id"= $1)`,
//             values: [req.body.pd_id]
//         })
//         if (existsResult.rows[0].exists) {
//             return res.status(409).json({ error: `pd_id ${req.body.pd_id}is exists` })
//         }
//         const result = await database.query({
//             text: `Insert Into Products ("pd_id","pd_name","pd_price","pd_typeid","brand_id")
//             VALUES ($1,$2,$3,$4,$5)`,
//             values: [
//                 req.body.pd_id,//$1
//                 req.body.pd_name,//$2
//                 req.body.pd_price,//$3
//                 req.body.pd_typeid,//$4
//                 req.body.brand_id,//$5
//             ]
//         })
//         // build simple dateTime return to Client
//     } catch (err) {
//         return res.status(500).json({ error: err.message })
//     }
//     const datetime = new Date()
//     bodyDate.createDate = datetime
//     res.status(201).json(bodyDate)
// })
app.use(memberRoute)
app.use(cartRoute) 
// swagger
const swaggerfile = fs.readFileSync('service/swagger.yaml','utf-8')
const swaggerDoc = yaml.parse(swaggerfile)
// กำหนด path ที่จะให้เรียกหน้า Document ขึ้นมา
app.use('/',swaggerUI.serve,swaggerUI.setup(swaggerDoc))


app.get(`/`, (req, res) => {
    console.log(`get / requessed`)
    res.status(200).json({ message: "Request OK" })
})

//app.get(`/products`,async(req,res)=>{
    // console.log(`get /Products is requested`)
    // try{

    //     const strQry='SELECT * FROM products order by "pd_id"'
    //     const result = await database.query(strQry)
    //     return res.status(200).json(result)
    // }
    // catch(err){
    //     return res.status(500).json({
    //         error:err.message
    //     })

    // }
//})

app.listen(port, () => {
    console.log(`server is running on port:${port}`)
})