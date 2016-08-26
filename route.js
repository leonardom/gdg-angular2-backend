'use strict'

const Joi = require('joi')
const Boom = require('Boom')
const Beer = require('./beer')

const DEFAULT_PAYLOAD_VALIDATION = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().optional(),
  rating: Joi.number().integer().optional(),
  imageUrl: Joi.string()
})

module.exports.create = {
  handler: (request, reply) => {
    Beer.forge(request.payload)
      .save()
      .then( (saved) => reply(saved.toJSON()) )
      .catch( (err) => reply(Boom.conflict(err.detail)) )
  },
  validate: {
    payload: DEFAULT_PAYLOAD_VALIDATION
  }
}

module.exports.find = {
  handler: (request, reply) => {
    Beer.forge({id: request.params.id})
    .fetch({ required: true }) //tells it needs to find
    .then( (found) => reply( found.toJSON() ) )
    .catch( (err) => reply( Boom.notFound() ) )
  }
}

module.exports.findAll = {
  handler: (request, reply) => {
    Beer.forge()
    .fetchAll()
    .then( (collection) => reply(collection.toJSON()))
    .catch( (err) => reply( Boom.notFound() ) )
  }
}

module.exports.update = {
  handler: (request, reply) => {
    Beer.forge({id: request.params.id})
      .save(request.payload)
      .then( (saved) => reply(saved.toJSON()) )
      .catch( (err) => reply(Boom.conflict(err.detail)) )
  },
  validate: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    }),
    payload: DEFAULT_PAYLOAD_VALIDATION
  }
}

module.exports.delete = {
  handler: (request, reply) => {
    Beer.forge({id: request.params.id})
    .fetch({ required: true }) //tells it needs to find
    .then( (found) => {
      found.destroy()
        .then( () => reply({deleted: true}) )
        .catch( (err) => reply(Boom.notFound()) )
    })
    .catch( (err) => reply(Boom.notFound()) )
  },
  validate: {
    params: Joi.object({
      id: Joi.number().integer().required(),
    })
  }
}
