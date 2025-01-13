import mysql from 'mysql2'
import dotenv from 'dotenv'
import { getDateWeek } from './utils.js'
dotenv.config()

const connectionDB = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

connectionDB.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!')
})

const query = `CREATE TABLE IF NOT EXISTS bidInfos (
    id integer PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(255) NOT NULL,
    month VARCHAR(255) NOT NULL,
    day VARCHAR(255) NOT NULL,
    week VARCHAR(255) NOT NULL,
    count integer NOT NULL DEFAULT 1,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);`

connectionDB.query(query);

export async function getUsers() {
    const [rows] = await connectionDB.query("SELECT * FROM users")
    return rows
}

export async function getUser(id) {
    const [row] = await connectionDB.query(`SELECT * FROM users WHERE id = ?`, [id])
    return row
}

export async function createUser(first_name, last_name) {
    const [result] = await connectionDB.query(`
        INSERT INTO users (first_name, last_name)
        VALUES (?, ?)
        `, [first_name, last_name])
    const id = result.insertId
    return getUser(id)
}

export async function getBids() {
    const [rows] = await connectionDB.query("SELECT * FROM bidInfos")
    return rows
}

export async function getBidById(id) {
    const [row] = await connectionDB.query(`SELECT * FROM bidInfos WHERE id = ?`, [id])
    return row
}

export async function createBid(first_name, last_name) {
    const month = new Date().getMonth()
    const day = new Date().getDate()
    const week = getDateWeek(new Date());
    const [result] = await connectionDB.query(`
        INSERT INTO bidInfos (userId, month, day, week)
        VALUES (?, ?, ?, ?)
        `, [first_name + last_name, month, day, week])
    const id = result.insertId
    return getBidById(id)
}

export async function updateBid(first_name, last_name, bid_count) {
    const month = new Date().getMonth()
    const day = new Date().getDate()
    const week = getDateWeek(new Date())
    const [result] = await connectionDB.query(`
        UPDATE bidInfos
        SET count = ${bid_count}
        WHERE userId = '${first_name + last_name}' AND month = '${month}'
        AND day = '${day}'
        AND week = '${week}';
    `)
    const id = result.insertId
    return getBidById(id)
}