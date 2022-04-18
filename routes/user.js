const express = require('express');
const passport = require('passport');
const userController = require('../controllers/user');
 
const router = express.Router();

router.get('/profile', passport.isAuthenticated ,userController.profile);

router.get('/signin', userController.signin_get);
router.post('/signup', userController.signup_post);

router.post('/login', passport.authenticate(
    'local',
    {
        failureRedirect: '/user/signin'
    }
),userController.login_post)

router.get('/logout', userController.logout);


module.exports = router;
