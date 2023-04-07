const jwt = require('jsonwebtoken')

const secret = 'adsuasgdhjasgdhjdgahjsg12hj3eg12hj3g12hj3g12hj3g123'

exports.userAuth = (req, res, next) => {
	const authToken = req.headers['authorization']

	if (authToken != undefined) {
		const bearer = authToken.split(' ')
		const token = bearer[1]

		try {
			const decoded = jwt.verify(token, secret)

			if (decoded.role >= 100) {
				next()
			}
			else {
				res.status(401)
				res.json({
					status: 401,
					message: 'Não autorizado'
				})

				return
			}
		}
		catch (err) {
			res.status(500)
			res.json({
				status: 500,
				message: 'Erro ao tentar realizar a autenticação',
				err: err
			})

			return
		}
	}
	else {
		res.status(401)
		res.json({
			status: 401,
			message: 'Não autorizado'
		})

		return
	}
}