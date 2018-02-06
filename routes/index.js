const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController')
const TagsController = require('../controllers/TagsController')
const AuthController = require('../controllers/AuthController')
const AccountController = require('../controllers/AccountController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(StoreController.index));
router.get('/stores', catchErrors(StoreController.index));
router.get('/add', AuthController.isLoggedIn, StoreController.add);
router.post('/add',
    StoreController.upload,
    catchErrors(StoreController.resize),
    catchErrors(StoreController.store)
);
router.get('/stores/:id/edit', catchErrors(StoreController.edit));
router.post('/add/:id',
    StoreController.upload,
    catchErrors(StoreController.resize),
    catchErrors(StoreController.update)
);

router.get('/tags', catchErrors(TagsController.index));
router.get('/tags/:tag', catchErrors(TagsController.index));

router.get('/login', AuthController.loginForm);
router.post('/login', AuthController.login);
router.get('/register', AuthController.registerForm);
router.post('/register',
    AuthController.validateRegister,
    catchErrors(AuthController.register),
    AuthController.login
);

router.get('/logout', AuthController.logout);

router.get('/account', AuthController.isLoggedIn, AccountController.edit);
router.post('/account', AuthController.isLoggedIn, catchErrors(AccountController.update));

module.exports = router;
