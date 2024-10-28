import pkg from "pg"
const{Pool} = pkg
import dotenv from 'dotenv'
dotenv.config()

const dbserver = process.env.dbserver
const dbuser = process.env.dbuser
const dbpassword = process.env.dbpassword
const dbhost = process.env.dbhost
const dbport = process.env.dbport
const db = process.env.db

export default   new Pool({
    //connectionString:`postgres://dev:${encodeURIComponent('1234')}@127.0.0.1:5432/KuShop`
    connectionString:`${dbserver}://${dbuser}:${encodeURIComponent(dbpassword)}@${dbhost}:${dbport}/${db}`
})