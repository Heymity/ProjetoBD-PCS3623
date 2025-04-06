import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { queryGames, gameById, addGame, searchGames, getGenders, queryEstudios, estudioById, addUser, getUserForLogin, addAvaliation, getAvaliationByGameId, getAvaliationByUserName } from './database.js'
 
const app = express()
const port = 3000

app.use(express.json())

async function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)
	
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		console.log(err)

		if (err) return res.sendStatus(403)

		req.user = user

		next()
	})
}

app.get('/jogo', async (req, res) => {
	const games = await queryGames();
    res.send(games)
})

app.get('/jogo/:id', async (req, res) => {
	const params = req.params

	const game = await gameById(params.id);
    res.send(game)
})

app.post('/jogo', async (req, res) => {
	const body = req.body
	const name = body.name
	const description = body.description
	const releaseDate = body.releaseDate
	const players = body.players 
	const image = body.image
	const studioId = body.studioId

	try {
		const game = await addGame(name, description, releaseDate, players, image, studioId)
		res.send(game)
	} catch (error) {
		res.status(400).send(error.message)
	}
})

/*
{
	"ratingFrom": 0,
	"ratingTo": 10,
	"releaseDateFrom": "2024-05-05",
	"releaseDateTo": "2025-05-05",
	"popularityFrom": 0,
	"popularityTo": 1000,
	"gendersId": [
		0, 1
	],
	"name": "a",
	"studioName": "b" 
}
*/
app.post('/jogo/search', async (req, res) => {
	console.log('entrou na busca')
	const body = req.body
	const ratingFrom = body.ratingFrom
	const ratingTo = body.ratingTo
	const releaseDateFrom = body.releaseDateFrom
	const releaseDateTo = body.releaseDateTo
	const popularityFrom = body.popularityFrom
	const popularityTo = body.popularityTo
	const gendersId = body.gendersId
	const name = body.name
	const studioName = body.studioName

	console.log(ratingFrom, ratingTo, releaseDateFrom, releaseDateTo, popularityFrom, popularityTo, gendersId, name, studioName)
	const results = await searchGames(ratingFrom, ratingTo, releaseDateFrom, releaseDateTo, popularityFrom, popularityTo, gendersId, name, studioName);
	res.send(results)
})


app.get('/estudio', async (req, res) => {
	const games = await queryEstudios();
    res.send(games)
})

app.get('/estudio/:id', async (req, res) => {
	const params = req.params
	const est = await estudioById(params.id);
	res.send(est)
})


app.post('/user/logon', async (req, res) => {
	const body = req.body

	const email = body.email
	const name = body.name
	const description = body.description
	const password = body.password
	const image = body.image

	try {
		const user = await addUser(email, name, description, password, image)
		
		const accessToken = jwt.sign({ 
			id: user.EMAIL,
		}, process.env.JWT_SECRET, { expiresIn: "3d" })
		
		const { SENHA, ...other } = user
		res.status(200).json({ ...other, accessToken })
	} catch (error) {
		res.status(400).send(error.message)
	}
		
})


app.post('/user/login', async (req, res) => {
	const body = req.body
	const email = body.email
	const originalPassword = body.password

	const user = await getUserForLogin(email)
	console.log(user)
    if (!user) return res.status(401).json("Wrong Credentials")

	const isPasswordValid = await bcrypt.compare(originalPassword, user.SENHA)
	if (!isPasswordValid) return res.status(401).json("Wrong Credentials")

	const accessToken = jwt.sign({ 
		id: user.EMAIL,
	}, process.env.JWT_SECRET, { expiresIn: "3d" })

	console.log(user)
	const { SENHA, ...other } = user
	res.status(200).json({ ...other, accessToken })
})


app.post('/avaliacao', authenticateToken, async (req, res) => {
	const body = req.body

	const email = req.user.id
	const text = body.text
	const gameId = body.gameId
	const note = body.note
	res.send(await addAvaliation(email, text, gameId, note))

})

app.get('/avaliacao/jogo/:id', async (req, res) => {
	const params = req.params
	const gameId = params.id
	const av = await getAvaliationByGameId(gameId)
	res.send(av)
})

app.get('/avaliacao/user/:username', async (req, res) => {
	const params = req.params
	const userId = params.username
	const av = await getAvaliationByUserName(userId)
	res.send(av)
})


app.get('/genero', async (req, res) => {
	const genders = await getGenders();
	res.send(genders)
})


app.get('/', (req, res) => {
  res.send('Olá Mundo!')
})

app.listen(port, () => {
  console.log(`App de exemplo esta rodando na porta ${port}`)
})
