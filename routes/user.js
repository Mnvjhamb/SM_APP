const express = require('express');
const passport = require('passport');
const userController = require('../controllers/user');
 
const router = express.Router();

router.get('/profile', passport.isAuthenticated ,userController.profile);
// router.get('/profile/followers', passport.isAuthenticated ,userController.profile_followers);
// router.get('/profile/following', passport.isAuthenticated ,userController.profile_following);

router.get('/post', passport.isAuthenticated, userController.post_get);
router.post('/post', passport.isAuthenticated, userController.create_post);

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
