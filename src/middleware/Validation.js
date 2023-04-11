
//CHECK VALIDATIONS
const { body, param } = require('express-validator')

exports.checkValidation = route => {
	switch (route) {
		case 'createUser':
			return [
				body('email')
					.notEmpty()
					.withMessage('Email é um campo obrigatório')
					.isEmail()
					.withMessage('Email inválido'),

				body('name')
					.optional(),

				body('password')
					.isLength({ min: 6 })
					.withMessage('A senha precisa ter no mínimo 6 caracteres'),

				body('age', 'Idade inválida')
					.optional()
					.isInt(),

				body('occupation')
					.optional()
			]

		case 'getUserPerPage':
			return [
				param('page', 'Número da página deve ser maior que 0')
					.isInt({ min: 1 }),
				param('perPage', 'Número de itens por página deve ser maior que 0')
					.isInt({ min: 1 })
			]

		case 'findUser':
			return (
				param('id', 'Código de usuário inválido')
					.isInt()
			)

		case 'editUser':
			return [
				body('id')
					.exists()
					.withMessage('Código de usuário é obrigatório')
					.isInt()
					.withMessage('Código de usuário inválido'),

				body('name')
					.optional({
						nullable: true,
						checkFalsy: true
					}),

				body('age')
					.optional({
						nullable: true
					})
					.isInt()
					.withMessage('Idade inválida'),

				body('occupation')
					.optional({
						nullable: true
					})
			]

		case 'deleteUser':
			return (
				param('id', 'Código de usuário inválido')
					.isInt()
			)

		case 'login':
			return [
				body('email')
					.notEmpty()
					.withMessage('Email é um campo obrigatório')
					.isEmail()
					.withMessage('Email inválido'),

				body('password')
					.isLength({ min: 6 })
					.withMessage('A senha precisa ter no mínimo 6 caracteres')
			]

		case 'recoverPassword':
			return (
				body('email')
					.notEmpty()
					.withMessage('Email é um campo obrigatório')
					.isEmail()
					.withMessage('Email inválido')
			)

		case 'changePassword':
			return [
				body('email')
					.notEmpty()
					.withMessage('Email é um campo obrigatório')
					.isEmail()
					.withMessage('Email inválido'),
				body('token')
					.notEmpty()
					.withMessage('Token é um campo obrigatório')
			]

		default:
			return
	}
}

//ERROR HANDLER
const { validationResult } = require('express-validator')

exports.errorHandler = (req, res, next) => {
	const { errors } = validationResult(req)

	if (errors.length > 0) {
		const errorList = errors.map(({ msg }) => msg)

		res.status(400)
		res.json({
			message: 'Dado(s) da requisição inválido(s)',
			err: errorList
		})

		return
	}
	else {
		next()
	}
}