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

    try{
        const user = await User.findById(req.params.id).populate('posts');
        
        let following = false; 
        if(user){
            for(let follower of user.followers){
                if(follower.userId === req.user._id.toString()){
                    following = true
                }
            }
            res.render('profile', {user, stalking: true, following})
        } else{
            throw "No such User"
        }
    } catch(e){
        console.log(e);
        req.flash('error', 'User not found');
        res.redirect('/user/profile');
    }
}

module.exports.follow = async (req, res)=>{

    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if(user && currentUser){
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
        } 

        req.flash('success', `Started following ${user.username}`);
        res.redirect('back')
    } else{
        req.flash('error', "No such user");
        res.redirect('back');
    }

}
module.exports.unfollow = async (req, res)=>{

    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if(user && currentUser){
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
        } 
        req.flash('success', `Unfollowed ${user.username}`)
        res.redirect('back')
    } else{
        req.flash('error', "No such user");
        res.redirect('back');
    }
}

module.exports.search = async (req, res)=>{
    
    const user = await User.findOne({username: req.body.username});

    if(user){      
        res.redirect(`/user/${user._id}`)
    } else{
        req.flash('error', "User not found")
        res.redirect('back')
    }
}

module.exports.signin_get = (req, res) => {
    if(req.isAuthenticated()){
        req.flash('info', 'Already Logged in')
        return res.redirect('/user/profile')
    }
    res.render('signin', {user: null});
}

module.exports.login_post = (req, res)=>{
    req.flash('success', `Welcome, ${req.user.username}`)
    res.redirect('/user/profile')
}

module.exports.signup_post = async (req, res) =>{

    let user = await User.findOne({username: req.body.username});
    if(!user){
        try{
            user = await new User(req.body);
            user.followers = [{
                userId: user._id.toString(),
                _id: new ObjectId()
            }];
            user.following = [{
                userId: user._id.toString(),
                _id: new ObjectId()
            }];
            await user.save();
        
            req.flash('success', "Successfully created your account")
            req.login(user, (err)=>{
                if(err) {
                    req.flash('error', err)
                    return res.redirect('/user/signin');
                }
                
                res.redirect('/user/profile');
            });
        }catch(e){
            console.log(e);
            req.flash("error", "Error in creating new user")
            res.redirect('back');
        }
    } else{
        req.flash("error", "Username already used");
        res.redirect('back');
    }
}

module.exports.logout = (req, res)=>{
    try {
        req.logout();
        req.flash('info', "Logged you out")
        res.redirect('/user/signin')
    } catch (error) {
        console.log(error);
        req.flash('error', 'An error occured');
        res.redirect('back');
    }
    
}

// module.exports.profile_followers = (req, res)=>{
//     res.render("profile", {posts: false, followers: true, following: false})
// }
// module.exports.profile_following = (req, res)=>{
//     res.render("profile", {posts: false, followers: false, following: true})
// }