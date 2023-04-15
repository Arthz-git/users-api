class HomeController {

	async index(req, res) {
		res.send('Servidor está rodando')
	}

}

module.exports = new HomeController()