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
const port = process.env.port || 3000; // Provide default port if not specified in env

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static file serving
app.use("/img_pd", express.static("img_pd"));
app.use("/img_mem", express.static("img_mem"));

// Session setup
const thesecret = process.env.secret;
app.use(session({
    secret: thesecret,
    resave: false,
    saveUninitialized: true
}));

// Route configurations
app.use("/chat", chatRoutes);
app.use(productRoute);
app.use(memberRoute);
app.use(cartRoute);

// Swagger setup
const swaggerfile = fs.readFileSync('service/swagger.yaml', 'utf-8');
const swaggerDoc = yaml.parse(swaggerfile);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Root route
app.get(`/`, (req, res) => {
    console.log(`get / requested`);
    res.status(200).json({ message: "Request OK" });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});
