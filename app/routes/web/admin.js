const express = require('express');
const router  = express.Router();

//Controllers:
const adminController = require('app/http/controllers/admin/adminController.js');
const courseController = require('app/http/controllers/admin/courseController.js');
const episodeController = require('app/http/controllers/admin/episodeController.js');
const commentController = require('app/http/controllers/admin/commentController.js');
const categoryController = require('app/http/controllers/admin/categoryController.js');
const userController = require('app/http/controllers/admin/userController.js');
const permissionController = require('app/http/controllers/admin/permissionController.js');
const roleController = require('app/http/controllers/admin/roleController.js');

//validators:
const courseValidator = require('app/http/validators/courseValidator.js');
const episodeValidator = require('app/http/validators/episodeValidator.js');
const categoryValidator = require('app/http/validators/categoryValidator.js');
const registerValidator = require('app/http/validators/registerValidator');
const permissionValidator = require('app/http/validators/permissionValidator');
const roleValidator = require('app/http/validators/roleValidator');


//helpers:
const upload = require('app/helpers/uploadImages.js');
const gate = require('app/helpers/gate.js');

//Middlewares:
const convertFileToFiled = require('app/http/middleware/convertFileToField');

//Defining MASTER PAGE for ADMIN PAGES:
router.use((req,res,next)=>{
    res.locals.layout = 'admin/master.ejs';
    next();
})

//Admin Routes:
router.get('/',adminController.index);
//Courses:
router.get('/courses',gate.can('show-courses'),
    courseController.index);
router.get('/courses/create',gate.can('show-courses'), courseController.create);
router.post('/courses/create',gate.can('show-courses'),upload.single('images'),
    convertFileToFiled.handle,
    courseValidator.handle(),
    courseController.store);
router.delete('/courses/:id',gate.can('show-courses'), courseController.destroy);
router.get('/courses/:id/edit',gate.can('show-courses'), courseController.edit);
router.put('/courses/:id',gate.can('show-courses'),upload.single('images'),
    convertFileToFiled.handle,
    courseValidator.handle(), courseController.update);

//Episode Routes:
router.get('/episodes',gate.can('show-courses'),episodeController.index);
router.get('/episodes/create',gate.can('show-courses'),episodeController.create);
router.post('/episodes/create',gate.can('show-courses'),episodeValidator.handle(),
    episodeController.store);
router.delete('/episodes/:id',gate.can('show-courses'),episodeController.destroy);
router.get('/episodes/:id/edit',gate.can('show-courses'),episodeController.edit);
router.put('/episodes/:id',gate.can('show-courses'),episodeValidator.handle(),
    episodeController.update);

//Category Routes:
router.get('/categories',gate.can('show-courses'),categoryController.index);
router.get('/categories/create',gate.can('show-courses'),categoryController.create);
router.post('/categories/create',gate.can('show-courses'),categoryValidator.handle(),
    categoryController.store);
router.get('/categories/:id/edit',gate.can('show-courses'),categoryController.edit);
router.put('/categories/:id',gate.can('show-courses'),categoryValidator.handle(),
    categoryController.update);
router.delete('/categories/:id',gate.can('show-courses'),categoryController.destroy);


//comments administrating:
router.get('/comments/approved',gate.can('manage-comments'),commentController.approved);
router.get('/comments',gate.can('manage-comments'),commentController.index);
router.delete('/comments/:id',gate.can('manage-comments'),commentController.destroy);
router.put('/comments/:id/approved',gate.can('manage-comments'), commentController.update);

//for CKEditor :
router.post('/upload-image',upload.single('upload'),
    adminController.uploadImage);

// for controller USERS by Admin :
router.get('/users',gate.can('manage-users'), userController.index);
router.get('/users/create',gate.can('manage-users'), userController.create);
router.post('/users/store',gate.can('manage-users'),registerValidator.handle(),
                                userController.store);
router.delete('/users/:id',gate.can('manage-users'),
    userController.destroy);

router.get('/users/:id/toggleadmin',gate.can('manage-users'),userController.toggleadmin);
router.get('/users/:id/addrole',gate.can('manage-users'),userController.addrole);
router.put('/users/:id/addrole',gate.can('manage-users'),userController.storeRoleForUser);

//Permission Routes:
router.get('/users/permissions',gate.can('manage-users'),permissionController.index);
router.get('/users/permissions/create',gate.can('manage-users'),permissionController.create);
router.post('/users/permissions/create',gate.can('manage-users'),permissionValidator.handle(),
    permissionController.store);
router.delete('/users/permissions/:id',gate.can('manage-users'),permissionController.destroy);
router.get('/users/permissions/:id/edit',gate.can('manage-users'),permissionController.edit);
router.put('/users/permissions/:id',gate.can('manage-users'),permissionValidator.handle(),
    permissionController.update);

//Role Routes:
router.get('/users/roles',gate.can('manage-users'),roleController.index);
router.get('/users/roles/create',gate.can('manage-users'),roleController.create);
router.post('/users/roles/create',gate.can('manage-users'),roleValidator.handle(),
    roleController.store);
router.delete('/users/roles/:id',gate.can('manage-users'),roleController.destroy);
router.get('/users/roles/:id/edit',gate.can('manage-users'),roleController.edit);
router.put('/users/roles/:id',gate.can('manage-users'),roleValidator.handle(),
    roleController.update);

module.exports = router;