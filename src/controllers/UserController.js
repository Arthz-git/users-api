const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')

class UserController {

	async getAll(req, res) {
		try {
			const users = await User.findAll()

			res.status(200)
			res.json(users)
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar buscar usuários',
				err: String(err)
			})
		}
	}

	async getByPage(req, res) {
		try {
			const { page, perPage } = req.params

			const users = await User.getPerPage(page, perPage)

			res.status(200)
			res.json(users)
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar buscar usuários por página',
				err: String(err)
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
				err: String(err)
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

			const user = await User.findByEmail(email)

			if (user === undefined) {
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
				err: String(err)
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
				err: String(err)
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
				res.status(403)
				res.json({
					message: 'Usuário informado não existe'
				})
			}
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar usuário',
				err: String(err)
			})
		}
	}

	async recoverPassword(req, res) {
		try {
			const { email } = req.body

			const user = await User.findByEmail(email)

			if (user) {
				const result = await PasswordToken.create()

				if (result.status) {
					res.status(200)
					res.json({
						message: 'Credencial gerada com sucesso',
						data: String(result.token)
					})
				}
				else {
					res.status(406)
					res.send(result.err)
				}
			}
			else {
				res.status(403)
				res.json({
					message: 'Usuário informado não existe'
				})
			}
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar recuperar a senha',
				err: String(err)
			})
		}
	}

	async changePassword(req, res) {
		try {
			const { token, password } = req.body

			const isTokenValid = await PasswordToken.validate(token)

			if (isTokenValid.status) {
				await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)

				res.status(200)
				res.json({
					message: 'Senha alterada com sucesso'
				})
			}
			else {
				res.status(406)
				res.json({
					message: 'Credenciais inválidas'
				})
			}
		}
		catch (err) {
			res.status(500)
			res.json({
				message: 'Erro ao tentar alterar a senha',
				err: String(err)
			})
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body

			const user = await User.findByEmail(email)

			const secret = process.env.JWT_SECRET

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
				message: 'Erro ao tentar fazer login de usuário',
				err: String(err)
			})
		}
	}

}

module.exports = new UserController()