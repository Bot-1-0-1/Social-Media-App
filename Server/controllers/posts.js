import Post from "../models/Posts.js";
import User from "../models/User.js";

/* CREATE */

export const createPost = async (req, res) => {
    try {
      const { userId, description, picturePath } = req.body;
      const user = await User.findById(userId);
      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes: {},
        comments: [],
      });
      await newPost.save();
  
      const post = await Post.find();
      res.status(201).json(post);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };


/* READ */

export const getFeedPosts = async( req, res ) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message : error.message})
    }
}

export const getUserPosts = async( req, res ) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message : error.message})
    }
}


/* UPDATE */

export const likePost = async( req , res ) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);                     // Returns a boolean. We are checking if the user Id exists in the like ( means the user who liked have their id stored)

        if(isLiked){
            post.likes.delete(userId);                              // Deletes the userId if it exists
        }else{
            post.likes.set(userId ,true);                           // Sets the userId if it doesn't exists
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes : post.likes},
            {new : true}
        );

        res.status(200).json(updatedPost);
        
    } catch (error) {
        res.status(404).json({ message : error.message});
    }
}