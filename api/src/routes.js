const { Router } = require('express');

const UserController = require('./controllers/UserController');
const GroupController = require('./controllers/GroupController');
const LockController = require('./controllers/LockController');
const LocalFisicoController = require('./controllers/LocalFisicoController');

const routes = Router();

//Rotas de Users

routes.get('/search/users', UserController.show);
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.delete('/users/delete', UserController.destroy);
routes.put('/users', UserController.Update);

//Rotas de groups

routes.get('/search/groups', GroupController.show);
routes.get('/groups', GroupController.index);
routes.post('/groups', GroupController.store);
routes.delete('/groups/delete', GroupController.destroy);
routes.put('/groups', GroupController.Update);

//Rotas de Locks

routes.get('/search/locks', LockController.show);
routes.get('/locks', LockController.index);
routes.post('/locks', LockController.store);
routes.delete('/locks/delete', LockController.destroy);
routes.put('/locks', LockController.Update);

//Rotas de Local Fisico

routes.get('/search/localFisico', LocalFisicoController.show);
routes.get('/localFisico', LocalFisicoController.index);
routes.post('/localFisico', LocalFisicoController.store);
routes.delete('/localFisico/delete', LocalFisicoController.destroy);
routes.put('/localFisico', LocalFisicoController.Update);



module.exports = routes;