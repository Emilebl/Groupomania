// Imports
const express = require('express');
const router = express.Router();
const bouncer = require ('express-bouncer')(9000, 600000, 3);
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Routes
// We use the auth middleware the routes were we need to verify the token and authentify the requests
// We use the multer middleware on the routes that will need to handle image files
router.post("/signup", multer, userCtrl.signup);
router.post("/login", bouncer.block, userCtrl.login);
router.get('/me', auth, userCtrl.getUserProfile);
router.put('/update', auth, multer, userCtrl.updateProfile);
router.delete('/delete', auth, userCtrl.deleteProfile);





module.exports = router;