const User = require('../models/user')
const Post = require('../models/post')


module.exports.profile = async(req, res)=>{

    const user = await User.findById(req.user._id).populate('posts');


    res.render("profile" , {user})
}
// module.exports.profile_followers = (req, res)=>{
//     res.render("profile", {posts: false, followers: true, following: false})
// }
// module.exports.profile_following = (req, res)=>{
//     res.render("profile", {posts: false, followers: false, following: true})
// }

module.exports.post_get = (req, res)=>{
    res.render('createPost');
}

module.exports.create_post = async (req, res)=>{
    const post = await new Post(req.body);
    post.user = req.user;
    await post.save();

    await User.findByIdAndUpdate(req.user._id, {
        $push: {
            posts: post
        }
    });

    res.redirect('/user/profile')
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