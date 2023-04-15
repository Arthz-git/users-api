const jwt = require('jsonwebtoken')

exports.userAuth = (req, res, next) => {
	try {
		const authToken = req.headers['authorization']

		if (authToken != undefined) {
			const bearer = authToken.split(' ')
			const token = bearer[1]
			const secret = process.env.JWT_SECRET

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
			message: 'Erro ao tentar realizar a autenticação',
			err: String(err)
		})
	}
}