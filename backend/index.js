import express from "express";
import pkg from "pg";
import database from "./service/database.js";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import productRoute from "./routes/musicRoute.js";
import memberRoute from "./routes/userRoute.js";
import cors from "cors";
import axios from "axios";
import session from "express-session";
import cartRoute from "./routes/favRoute.js";
import swaggerUI from "swagger-ui-express";
import chatRoutes from "./routes/chatRoute.js";
import yaml from "yaml";
import fs from "fs";

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = process.env.port;

app.use(bodyParser.json());
app.use("/chat",cors(), chatRoutes);
app.use("/img_pd", express.static("img_pd"));
app.use("/img_mem", express.static("img_mem"));

const thesecret = process.env.secret;

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // ให้การตอบสนองต่อ OPTIONS สำหรับทุกเส้นทาง

app.use(session({
    secret: thesecret,
    resave: false,
    saveUninitialized: true
}));

app.use(productRoute);
app.use(memberRoute);
app.use(cartRoute);

// swagger
const swaggerfile = fs.readFileSync('service/swagger.yaml', 'utf-8');
const swaggerDoc = yaml.parse(swaggerfile);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.get(`/`, (req, res) => {
    console.log(`get / requested`);
    res.status(200).json({ message: "Request OK" });
});

app.listen(port, () => {
    console.log(`server is running on port:${port}`);
});
