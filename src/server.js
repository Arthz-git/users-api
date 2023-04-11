
require('dotenv').config()

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const router = require('./routes')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/', router)

const port = 8686
app.listen(port, () => {
	console.log(`[SERVER] server is running at port ${port}`)
})
