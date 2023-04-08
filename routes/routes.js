const express = require('express')

//controllers
const HomeController = require('../controllers/HomeController')
const UserController = require('../controllers/UserController')

//middlewares
const { userAuth } = require('../middleware/UserAuth')
const {
	checkValidation,
	errorHandler
} = require('../middleware/Validation')

const router = express.Router()

router.get(
	'/',
	HomeController.index
)

router.post(
	'/user',
	checkValidation('createUser'),
	errorHandler,
	UserController.create
)

router.get(
	'/user',
	UserController.getAll
)

router.get(
	'/user/:page/:perPage',
	checkValidation('getUserPerPage'),
	errorHandler,
	UserController.getByPage
)

router.get(
	'/user/:id',
	userAuth,
	checkValidation('findUser'),
	errorHandler,
	UserController.find
)

router.put(
	'/user',
	userAuth,
	checkValidation('editUser'),
	errorHandler,
	UserController.edit
)

router.delete(
	'/user/:id',
	userAuth,
	checkValidation('deleteUser'),
	errorHandler,
	UserController.delete
)

router.post(
	'/recoverpassword',
	UserController.recoverPassword
)

router.post(
	'/changepassword',
	UserController.changePassword
)

router.post(
	'/login',
	UserController.login
)

module.exports = router