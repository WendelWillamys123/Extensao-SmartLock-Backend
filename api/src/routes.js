const { Router } = require('express');
const UserController = require('./controllers/UserController');

const routes = Router();

routes.get('/search/users', UserController.show);
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.delete('/users/delete', UserController.destroy);


module.exports = routes;