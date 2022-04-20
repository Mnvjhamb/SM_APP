const Post = require("../models/post");


module.exports.show_post = async (req, res)=>{
    const post = await Post.findById(req.params.id).populate("user");
    let authorized = false;
    if(post.user._id.toString() === req.user._id.toString()){
        authorized = true;
    }

    res.render('showPost', {post, authorized})
}


module.exports.update_post_get =  async(req, res)=>{
    res.render('updatePost', {post: req.post_to_be_updated} )
}

module.exports.update_post = async(req, res)=>{
    
    const post = await Post.findByIdAndUpdate(req.post_to_be_updated._id.toString(),{
        title: req.body.title,
        description: req.body.description
    })
    post.save();
    res.redirect(`/posts/${post._id.toString()}`)
    // update post
}

module.exports.delete_post = async (req, res)=>{
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/user/profile')
}