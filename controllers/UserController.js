const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')

const secret = 'adsuasgdhjasgdhjdgahjsg12hj3eg12hj3g12hj3g12hj3g123'

class UserController {

	async getAll(req, res) {
		try {
			const users = await User.findAll()

			res.json(users)
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar buscar usuários',
				err: err
			})
		}
	}

	async find(req, res) {
		try {
			const id = req.params.id

			const user = await User.findById(id)

			if (user == undefined) {
				res.status(404)
				res.json({
					message: 'Usuário não encontrado'
				})
			}
			else {
				res.status(200)
				res.json(user)
			}
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar encontrar usuário',
				err: err
			})
		}
	}

	async create(req, res) {
		try {
			const {
				email,
				name,
				password,
				age,
				occupation
			} = req.body

			const emailExists = await User.findEmail(email)

			if (emailExists) {
				res.status(406)
				res.json({
					message: 'Email já cadastrado'
				})

				return
			}

			await User.create(
				email,
				name,
				password,
				age,
				occupation
			)

			res.status(200)
			res.json({
				message: 'Usuário cadastrado com sucesso'
			})
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar criar novo usuário',
				err: err
			})
		}
	}

	async edit(req, res) {
		try {
			const {
				id,
				name,
				age,
				occupation
			} = req.body

			const user = await User.findById(id)

			if (user) {
				await User.update(
					id,
					name,
					age,
					occupation
				)

				res.status(200)
				res.json({
					message: 'Usuário editado com sucesso'
				})
			}
			else {
				res.status(404)
				res.json({
					message: 'Usuário informado não existe'
				})
			}
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar editar usuário',
				err: err
			})
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id

			const user = await User.findById(id)

			if (user) {
				await User.delete(id)

				res.status(200)
				res.json({
					message: 'Usuário deletado'
				})
			}
			else {
				res.status(404)
				res.json({
					message: 'Usuário informado não existe'
				})
			}
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar usuário',
				err: err
			})
		}
	}

	async recoverPassword(req, res) {
		const email = req.body.email
		const result = await PasswordToken.create(email)

		if (result.status) {
			res.status(200)
			res.send('' + result.token)
		}
		else {
			res.status(406)
			res.send(result.err)
		}
	}

	async changePassword(req, res) {
		const token = req.body.token
		const password = req.body.password
		const isTokenValid = await PasswordToken.validate(token)

		if (isTokenValid.status) {
			await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)

			res.status(200)
			res.send('Senha alterada')
		}
		else {
			res.status(406)
			res.send('Token inválido!')
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body

			const user = await User.findByEmail(email)

			if (user != undefined) {
				const resultado = await bcrypt.compare(password, user.password)

				if (resultado) {
					const token = jwt.sign({ email: user.email, role: user.role }, secret)

					res.status(200)
					res.json({
						token: token
					})
				}
				else {
					res.status(406)
					res.json({
						message: 'Senha incorreta'
					})
				}
			}
			else {
				res.status(404)
				res.json({
					message: 'Usuário não cadastrado'
				})
			}
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar buscar usuário',
				err: err
			})
		}
	}

}

module.exports = new UserController()