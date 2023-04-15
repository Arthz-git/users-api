
require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')

const app = express()
const router = require('./routes')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use('/', router)

app.use((req, res, next) => {
	res.status(404).send('Erro 404 -- Rota não encontrada')
})

app.use((err, req, res, next) => {
	res.status(500).send('Erro 500 -- Servidor com problemas')
})

const port = 8686
app.listen(port, () => {
	console.log(`[SERVER] server is running at port ${port} -- try localhost:${port}`)
})
