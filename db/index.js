'use strict'

const knexfile = require('./knexfile')
const knex = require('knex')(knexfile['development'])

const bookshelf = require('bookshelf')(knex)

bookshelf.plugin('visibility')
bookshelf.plugin('registry')

module.exports = bookshelf
