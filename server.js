'use strict';

const Hapi = require('hapi')

const Joi = require('joi')
const Boom = require('Boom')
const Beer = require('./beer')

const server = new Hapi.Server();
server.connection({
   port: 3000,
   routes: {
    cors: {
      origin: ['*']
    }
  }
 });

server.route({
  method: 'POST',
  path: '/beers',
  handler: (request, reply) => {
    Beer.forge(request.payload)
      .save()
      .then( (saved) => {
        saved.set('price', Number(saved.get('price')))
        saved.set('rating', Number(saved.get('rating')))

        reply(saved.toJSON())
      })
      .catch( (err) => reply(Boom.conflict(err.detail)) )
  }
});

server.route({
  method: 'GET',
  path: '/beers/{id}',
  handler: (request, reply) => {
    Beer.forge({id: request.params.id})
    .fetch({ required: true }) //tells it needs to find
    .then( (found) => reply( found.toJSON() ) )
    .catch( (err) => reply( Boom.notFound() ) )
  }
});

server.route({
  method: 'GET',
  path: '/beers',
  handler: (request, reply) => {
    Beer.forge()
    .fetchAll()
    .then( (collection) => reply(collection.toJSON()))
    .catch( (err) => reply( Boom.notFound() ) )
  }
})

server.route({
  method: 'PUT',
  path: '/beers/{id}',
  handler: (request, reply) => {
    Beer.forge({id: request.params.id})
      .save(request.payload)
      .then( (saved) => reply(saved.toJSON()) )
      .catch( (err) => reply(Boom.conflict(err.detail)) )
  }
});

server.route({
  method: 'DELETE',
  path: '/beers/{id}',
  handler: (request, reply) => {
    Beer.forge({id: request.params.id})
    .fetch({ required: true }) //tells it needs to find
    .then( (found) => {
      found.destroy()
        .then( () => reply({deleted: true}) )
        .catch( (err) => reply(Boom.notFound()) )
    })
    .catch( (err) => reply(Boom.notFound()) )
  }
});

server.start(err => {
  if (err) {
    throw err;
  }

  console.log('Server running on ', server.info.uri);
});
