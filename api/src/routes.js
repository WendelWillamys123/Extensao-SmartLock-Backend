const { Router } = require('express');
const UserController = require('./controllers/UserController');
const GroupController = require('./controllers/GroupController');
const LockController = require('./controllers/LockController');

const routes = Router();

routes.get('/search/users', UserController.show);
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.delete('/users/delete', UserController.destroy);

routes.get('/search/groups', GroupController.show);
routes.get('/groups', GroupController.index);
routes.post('/groups', GroupController.store);
routes.delete('/groups/delete', GroupController.destroy);
routes.put('/groups', GroupController.Update);

routes.get('/search/locks', LockController.show);
routes.get('/locks', LockController.index);
routes.post('/locks', LockController.store);
routes.delete('/locks/delete', LockController.destroy);
routes.put('/locks', LockController.Update);



module.exports = routes;