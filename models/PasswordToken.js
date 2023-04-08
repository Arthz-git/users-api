const knex = require('../database/connection')
const { v4: uuidv4 } = require('uuid')

const User = require('./User')

class PasswordToken {

	async create() {
		try {
			const token = uuidv4()

			await knex.insert({
				user_id: user.id,
				used: 0,
				token: token
			}).table('passwordtokens')
		}
		catch (err) {
			throw err
		}
	}

	async validate(token) {
		try {
			const result = await knex.select().where({ token: token }).table('passwordtokens')

			if (result.length > 0) {
				const tk = result[0]

				if (tk.used) {
					return { status: false }
				}
				else {
					return {
						status: true,
						token: tk
					}
				}
			}
			else {
				return { status: false }
			}
		}
		catch (err) {
			console.log(err)

			return { status: false }
		}
	}

	async setUsed(token) {
		try {
			await knex.update({ used: 1 }).where({ token: token }).table('passwordtokens')
		}
		catch (err) {
			throw err
		}
	}
}

module.exports = new PasswordToken()