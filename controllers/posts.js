const Post = require("../models/post");
const User = require('../models/user')

module.exports.post_get = (req, res)=>{
    res.render('createPost');
}

module.exports.create_post = async (req, res)=>{
    try {    
        const post = await new Post(req.body);
        post.user = req.user;
        await post.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                posts: post
            }
        });

        req.flash('success', "Post created")

        res.redirect('/user/profile')
    } catch (error) {
        console.log(error);
        req.flash('error', "An error occured");
        res.redirect('back');
    }
}

module.exports.show_post = async (req, res)=>{
    try {    
        const post = await Post.findById(req.params.id).populate("user");
        let authorized = false;
        if(post.user._id.toString() === req.user._id.toString()){
            authorized = true;
        }

        res.render('showPost', {post, authorized})
    } catch (error) {
        console.log(error);
        req.flash('error', "An error occured");
        res.redirect('back');
    }
}


module.exports.update_post_get =  async(req, res)=>{
    res.render('updatePost', {post: req.post_to_be_updated} )
}

module.exports.update_post = async(req, res)=>{
    try{
        const post = await Post.findByIdAndUpdate(req.post_to_be_updated._id.toString(),{
            title: req.body.title,
            description: req.body.description
        })
        post.save();
        req.flash('success', "Post Updated")
        res.redirect(`/posts/${post._id.toString()}`)
    } catch(e){
        console.log(e);
        req.flash('error', "An error occured");
        res.redirect('back');
    }
    
}

module.exports.delete_post = async (req, res)=>{
    try{
        await Post.findByIdAndDelete(req.params.id);
        req.flash('info', 'Post Deleted')
        res.redirect('/user/profile')
    } catch(e){
        console.log(e);
        req.flash('error', "An error occured");
        res.redirect('back');
    }
}