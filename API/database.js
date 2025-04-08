import mysql from 'mysql2'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'

dotenv.config()
console.log(process.env.MYSQL_HOST)

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD, 
    database: process.env.MYSQL_DATABASE
}).promise()

export async function queryGames() {
    const [rows] = await pool.query("SELECT * FROM PCS_BD.JOGO")
    return rows
}

export async function gameById(id) {
    const [rows] = await pool.query("SELECT * FROM PCS_BD.JOGO WHERE ID_JOGO = ?", [id])
    return rows
}

export async function addGame(name, description, releaseDate, players, image, studioId) {
    if (!name || !description || !releaseDate || !players || !image || !studioId) {
        throw new Error('Missing required fields')
    }

    const imageId = await handleImages(image.filename)

    const [rows] = await pool.query("INSERT INTO PCS_BD.JOGO VALUES (?, ?, ?, ?, ?, ?, ?)", [0, name, description, releaseDate, players, imageId, studioId])
    return rows
}

async function handleImages(image) {
    if (!image) {
        return null
    }

    console.log(`Image saved with ${image}`)

    const [rows] = await pool.query("INSERT INTO PCS_BD.FOTO (FOTO) VALUES (?)", [image])
    return rows.insertId

}

async function getMaxPopularity() {
    const [rows] = await pool.query("SELECT MAX(MEMBROS) AS MAX_MEMBROS FROM PCS_BD.JOGO")
    return rows[0].MAX_MEMBROS
}

export async function searchGames(ratingFrom, ratingTo, releaseDateFrom, releaseDateTo, popularityFrom, popularityTo, gendersId, name, studioName) {
    if (!ratingFrom) ratingFrom = 0
    if (!ratingTo) ratingTo = 10
    if (!releaseDateFrom) releaseDateFrom = '1900-01-01'
    if (!releaseDateTo) releaseDateTo = '3100-01-01'
    if (!popularityFrom) popularityFrom = 0
    if (!popularityTo) popularityTo = await getMaxPopularity()
    if (!gendersId) gendersId = []
    if (!name) name = ''
    if (!studioName) studioName = ''

    let queryBase =  `
        SELECT JOGO.ID_JOGO, JOGO.NOME, JOGO.DESCRIÇÃO, JOGO.DATA_LANÇAMENTO, JOGO.MEMBROS, JOGO.ID_FOTO, JOGO.ID_ESTÚDIO, ESTÚDIO.NOME AS NOME_ESTUDIO, ESTÚDIO.ID_FOTO AS FOTO_ESTUDIO, avg(AVALIAÇÃO.NOTA) AS NOTA, GÊNERO_JOGO.ID_GÊNERO
        FROM PCS_BD.JOGO LEFT JOIN PCS_BD.ESTÚDIO ON JOGO.ID_ESTÚDIO = ESTÚDIO.ID_ESTÚDIO LEFT JOIN AVALIAÇÃO ON JOGO.ID_JOGO = AVALIAÇÃO.ID_JOGO LEFT JOIN GÊNERO_JOGO ON GÊNERO_JOGO.ID_JOGO = JOGO.ID_JOGO
        WHERE DATA_LANÇAMENTO BETWEEN ? AND ? AND MEMBROS BETWEEN ? AND ? AND JOGO.NOME LIKE ? AND ESTÚDIO.NOME LIKE ?`
    if ( gendersId.length > 0) {
        queryBase += ` AND (`
        queryBase += gendersId.map(() => `GÊNERO_JOGO.ID_GÊNERO = ?`).join(' OR ')
        queryBase += `)`
    }
    queryBase += ` 
        GROUP BY JOGO.ID_JOGO HAVING (avg(AVALIAÇÃO.NOTA) >= ? AND avg(AVALIAÇÃO.NOTA) <= ?) OR COUNT(AVALIAÇÃO.NOTA) = 0 
        ORDER BY avg(AVALIAÇÃO.NOTA) DESC`

    console.log(queryBase)
    const [rows] = await pool.query(queryBase, 
        [releaseDateFrom, releaseDateTo, popularityFrom, popularityTo, `%${name}%`, `%${studioName}%`, ...gendersId, ratingFrom, ratingTo])
    
    return rows
}

export async function getGenders() {
    const [rows] = await pool.query("SELECT * FROM PCS_BD.GÊNERO")
    return rows
}

export async function queryEstudios() {
    const [rows] = await pool.query("SELECT * FROM PCS_BD.ESTÚDIO")
    return rows
}

export async function estudioById(id) {
    const [rows] = await pool.query("SELECT * FROM PCS_BD.ESTÚDIO WHERE ID_ESTÚDIO = ?", [id])
    return rows
}

export async function addUser(email, name, description, password, image) {
    if (!email || !name || !description || !password) {
        throw new Error('Missing required fields')
    }

    const imageId = await handleImages(image.filename)

    const hash = bcrypt.hashSync(password, 10);

    const [rows] = await pool.query("INSERT INTO PCS_BD.USUÁRIO VALUES (?, ?, ?, ?, ?)", [email, name, description, hash, imageId])
    return rows
}

export async function getUserForLogin(email) {
    const [rows] = await pool.query("SELECT * FROM PCS_BD.USUÁRIO WHERE EMAIL = ?", [email])
    return rows[0]
}

export async function addAvaliation(email, text, gameId, note) {
    if (!email || !gameId || !note) {
        throw new Error('Missing required fields')
    }

    const [rows] = await pool.query(
        `INSERT INTO PCS_BD.AVALIAÇÃO (NOTA, TEXTO, EMAIL, ID_JOGO) 
        SELECT ?, ?, ?, ? WHERE (SELECT COUNT(EMAIL) FROM AVALIAÇÃO WHERE EMAIL = ? AND ID_JOGO = ?) = 0`, 
        [note, text, email, gameId, email, gameId]
    )
    return rows
}

export async function getAvaliationByGameId(gameId) {
    if (!gameId) {
        throw new Error('Missing required fields')
    }

    const [rows] = await pool.query(
        "SELECT ID_AVALIAÇÃO, NOTA, TEXTO, ID_JOGO, USUÁRIO.EMAIL, USUÁRIO.NOME, USUÁRIO.ID_FOTO FROM PCS_BD.AVALIAÇÃO JOIN USUÁRIO ON USUÁRIO.EMAIL = AVALIAÇÃO.EMAIL WHERE ID_JOGO = ?", 
        [gameId])
    return rows
}

export async function getAvaliationByUserName(username) {
    if (!username) {
        throw new Error('Missing required fields')
    }

    const [rows] = await pool.query(
        `SELECT ID_AVALIAÇÃO, NOTA, TEXTO, JOGO.ID_JOGO, JOGO.NOME AS NOME_JOGO, JOGO.ID_FOTO AS ID_FOTO_JOGO, JOGO.MEMBROS, JOGO.DATA_LANÇAMENTO, USUÁRIO.EMAIL, USUÁRIO.NOME AS USERNAME, USUÁRIO.ID_FOTO AS USER_FOTO_ID 
        FROM PCS_BD.AVALIAÇÃO JOIN USUÁRIO ON USUÁRIO.EMAIL = AVALIAÇÃO.EMAIL JOIN JOGO ON AVALIAÇÃO.ID_JOGO = JOGO.ID_JOGO
        WHERE USUÁRIO.NOME = ?`,
        [username])
    return rows
}

export async function getUserByEmail(email) {
    if (!email) {
        throw new Error('Missing required fields')
    }

    const [rows] = await pool.query(
        "SELECT * FROM PCS_BD.USUÁRIO WHERE EMAIL = ?", 
        [email])
    return rows
}

export async function getFotoById(fotoId) {
    const [rows] = await pool.query("SELECT FOTO FROM PCS_BD.FOTO WHERE ID_FOTO = ?", [fotoId])
	if (rows.length === 0) {
		throw new Error('Image not found')
	}
	const imagePath = rows[0].FOTO
	return imagePath
}


const estudios = await queryEstudios()
console.log(estudios)

const games = await queryGames()
console.log(games)

const genres = await getGenders()
console.log(genres)

//const image = await handleImages({ name: 'test.jpg', data: Buffer.from('test') })
//console.log(image)