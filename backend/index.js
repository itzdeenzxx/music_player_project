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
import chatRoutes from "./routes/chatRoute.js";
import yaml from "yaml"
// ใช้ File
import fs from "fs"

const { Pool } = pkg
dotenv.config()

const app = express()
//const port = 3000
const port = process.env.port

app.use(bodyParser.json())
app.use("/chat", chatRoutes);
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

app.use(memberRoute)
app.use(cartRoute) 
// swagger
const swaggerfile = fs.readFileSync('service/swagger.yaml','utf-8')
const swaggerDoc = yaml.parse(swaggerfile)
// กำหนด path ที่จะให้เรียกหน้า Document ขึ้นมา
app.use('/api-doc',swaggerUI.serve,swaggerUI.setup(swaggerDoc))


app.get(`/`, (req, res) => {
    console.log(`get / requessed`)
    res.status(200).json({ message: "Request OK" })
})

app.listen(port, () => {
    console.log(`server is running on port:${port}`)
})