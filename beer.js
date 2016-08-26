'use strict'

const db = require('./db')

const Beer = module.exports = db.Model.extend({
	tableName: 'beers',
})
