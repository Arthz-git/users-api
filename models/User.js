const bcrypt = require('bcrypt')

const knex = require('../database/connection')
const PasswordToken = require('./PasswordToken')

class User {

	async findAll() {
		try {
			const result = await knex.select([
				'id',
				'email',
				'name',
				'age',
				'occupation'
			]).table('users')

			return result
		}
		catch (err) {
			throw err
		}
	}

	async getPerPage(page, perPage) {
		try {
			const offset = page - 1

			const result = await knex.select([
				'id',
				'email',
				'name',
				'age',
				'occupation'
			]).table('users')
			.limit(perPage)
			.offset(offset * perPage)
			.orderBy('id')

			return result
		}
		catch (err) {
			throw err
		}
	}

	async findById(id) {
		try {
			const result = await knex.select(['*']).where({ id: id }).table('users')

			if (result.length > 0) {
				return result[0]
			}
			else {
				return undefined
			}
		}
		catch (err) {
			throw err
		}
	}

	async findByEmail(email) {
		try {
			const result = await knex.select(['*']).where({ email: email }).table('users')

			if (result.length > 0) {
				return result[0]
			}
			else {
				return undefined
			}
		}
		catch (err) {
			throw err
		}
	}

	async create(email, name, password, age = 0, occupation = '') {
		try {
			const hash = await bcrypt.hash(password, 10)

			await knex.insert({
				email: email,
				password: hash,
				name: name,
				age: age,
				occupation: occupation,
				role: 0
			}).table('users')
		}
		catch (err) {
			throw err
		}
	}

	async findEmail(email) {
		try {
			const result = await knex.select('*').from('users').where({ email: email })

			if (result.length > 0) {
				return true
			}
			else {
				return false
			}
		}
		catch (err) {
			console.log(err)

			return false
		}
	}

	async update(id, name, age, occupation) {
		try {
			const editUser = {}

			if (name != undefined) {
				editUser.name = name
			}

			if (age != undefined) {
				editUser.age = age
			}

			if (occupation != undefined) {
				editUser.occupation = occupation
			}

			await knex.update(editUser).where({ id: id }).table('users')
		}
		catch (err) {
			throw err
		}
	}

	async delete(id) {
		try {
			await knex.delete().where({ id: id }).table('users')
		}
		catch (err) {
			throw err
		}
	}

	async changePassword(newPassword, id, token) {
		const hash = await bcrypt.hash(newPassword, 10)

		await knex.update({ password: hash }).where({ id: id }).table('users')

		await PasswordToken.setUsed(token)
	}
}

module.exports = new User()