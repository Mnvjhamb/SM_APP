const User = require('../models/user')


module.exports.profile = (req, res)=>{
    res.render("profile")
}

module.exports.signin_get = (req, res) => {
    if(req.isAuthenticated()){
        return res.redirect('/user/profile')
    }
    res.render('signin', {user: null});
}

module.exports.login_post = (req, res)=>{
    res.redirect('/user/profile')
}

module.exports.signup_post = async (req, res) =>{
    const user = await new User(req.body);
    await user.save();

    req.login(user, (err)=>{
        if(err) {
            return res.redirect('/user/signup');
        }
        res.redirect('/user/profile');
    });

}

module.exports.logout = (req, res)=>{
    req.logout();
    res.redirect('/user/signin')
}