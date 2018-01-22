const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController')
const TagsController = require('../controllers/TagsController')
const AuthController = require('../controllers/AuthController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(StoreController.index));
router.get('/stores', catchErrors(StoreController.index));
router.get('/add', StoreController.add);
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
router.get('/register', AuthController.registerForm);
router.post('/register',
    AuthController.validateRegister,
    catchErrors(AuthController.register)
);

module.exports = router;
