const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types

const User = require('../models/user')
const Post = require('../models/post')


module.exports.profile = async(req, res)=>{
    const user = await User.findById(req.user._id).populate('posts');
    res.render("profile" , {user, stalking: false})
}


module.exports.stalk_user = async(req, res)=>{

    if(req.params.id === req.user._id.toString()){
        return res.redirect('/user/profile')
    }

    const user = await User.findById(req.params.id).populate('posts');
    let following = false;
    for(let follower of user.followers){
        if(follower.userId === req.user._id.toString()){
            following = true
        }
    }
    res.render('profile', {user, stalking: true, following})
}

module.exports.follow = async (req, res)=>{

    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    let following = false;
    for(follower of user.followers){
        if(follower.userId === currentUser._id.toString()){
            following = true
        }
    }

    if (!following) {
        await user.updateOne({ $push: 
            { 
                followers: {
                    userId: req.user._id.toString(),
                    _id: new ObjectId()
                } 
            } 
        });
        await currentUser.updateOne({ $push: 
            { 
                following: {
                    userId: req.params.id,
                    _id: new ObjectId()
                } 
            } 
        });
        res.redirect('back')
    }

}
module.exports.unfollow = async (req, res)=>{

    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    let following = false;
    for(follower of user.followers){
        if(follower.userId === currentUser._id.toString()){
            following = true
        }
    }

    if (following) {
        await user.updateOne({ $pull: 
            { 
                followers: {
                    userId: req.user._id.toString(),
                } 
            } 
        });
        await currentUser.updateOne({ $pull: 
            { 
                following: {
                    userId: req.params.id,
                } 
            } 
        });
        res.redirect('back')
    }

}

module.exports.search = async (req, res)=>{
    
    const user = await User.findOne({username: req.body.username});

    if(user){      
        res.redirect(`/user/${user._id}`)
    } else{
        console.log("USER not found");
        res.redirect('back')
    }
}

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
    user.followers = [{
        userId: user._id.toString(),
        _id: new ObjectId()
    }];
    user.following = [{
        userId: user._id.toString(),
        _id: new ObjectId()
    }];
    await user.save();

    req.login(user, (err)=>{
        if(err) {
            return res.redirect('/user/signin');
        }
        res.redirect('/user/profile');
    });

}

module.exports.logout = (req, res)=>{
    req.logout();
    res.redirect('/user/signin')
}

// module.exports.profile_followers = (req, res)=>{
//     res.render("profile", {posts: false, followers: true, following: false})
// }
// module.exports.profile_following = (req, res)=>{
//     res.render("profile", {posts: false, followers: false, following: true})
// }