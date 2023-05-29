const Post = require('../model/Post');
const User = require('../model/User');
const asyncHandler = require('express-async-handler');
const path = require('path');
const { ObjectId } = require('mongodb');
/*

Current functionality:
Create a new post with the user ID, first and last name + post content, title, location and type.
- Check if the user ID, post content, title, and type are provided, if not, return an error message.
- Check if the post content is longer than 1000 characters or post title is longer than 100 characters.
- Check if the user ID is valid.
- Check if the user ID is found in the database.
- Create a new post by inserting the user information + post content, title, location and type into the database.
- If the post is successfully created, return a success message, otherwise return an error message.

To-do:
- Allow users to upload images to their posts. Needs PictureUpload branch to be merged.
- Use separate identifier than User ID to verify user. User ID is not secure.
- Add a way to delete posts.
- Add a way to edit posts.
- Add a way to add comments to posts.
- Add a way to delete comments.
- Add a way to edit comments.
- Maybe add a way to like posts.
- Maybe add a way to like comments.


*/


const addPost = asyncHandler(async (req, res) => { 

  // Get the user ID + post content, title, location and type from the request body. It is optional to have the location.
  const _userID = req.body.userID;
  const _postContent = req.body.postContent;
  const _postTitle = req.body.postTitle;
  const _postType = req.body.postType;
  let _postLocation;
  // Check if post location is provided, if not, set it to "false".
    if (!req.body.postLocation) {
        _postLocation = "false";
    } else {
        _postLocation = req.body.postLocation;
    }


    // Check if the user ID, post content, title, and type are provided, if not, return an error message.

  if (!_postContent || !_postTitle || !_postType || !_userID) {
    return res.status(400).json({ 'message': 'Error: Post content, title, type, and user ID are required.' });
  }

  // If post content is longer than 1000 characters or post title is longer than 100 characters.
    if (_postContent.length > 1000) {
        return res.status(400).json({ 'message': 'Error: Post content is too long. (1000 characters maximum)' });
    } else if (_postTitle.length > 100) {
        return res.status(400).json({ 'message': 'Error: Post title is too long. (100 characters maximum)' });
    }

    // Verify user ID is a string of 24 hex characters
    if (!/^[0-9a-fA-F]{24}$/.test(_userID)) {
        return res.status(400).json({ 'message': 'User ID is invalid.' });
    }

    const foundUser = await User.findOne({ _id: new ObjectId(_userID) });

    // If user ID is not found, return an error message.
    if (!foundUser) {
        return res.status(400).json({ 'message': 'Error: User ID is invalid.' });
    }

    // Create a new post by inserting the user information + post content, title, location and type into the database.
    const newPost = await Post.create({
        userID: _userID,
        userFirstName: foundUser.firstName,
        userLastName: foundUser.lastName,
        postContent: _postContent,
        postTitle: _postTitle,
        postLocation: _postLocation,
        // postImages: _postImages,
        postType: _postType
    });

    // If the post is successfully created, return a success message, otherwise return an error message.
    if (newPost) {
        return res.status(201).json({ 'success': 'Post created successfully.' });
    } else {
        return res.status(400).json({ 'message': 'Error: Post could not be created.' });
    }
});

/*
const addComment = asyncHandler(async (req, res) => {
    
    // Get the post ID from the request body.
    const _postID = req.body.postID;
    
    // Get the user ID + comment content from the request body.
    const _userID = req.body.userID;
    const _commentContent = req.body.commentContent;

    // Check if the post ID, user ID, and comment content are provided, if not, return an error message.
    if (!_postID || !_userID || !_commentContent) {
        return res.status(400).json({ 'message': 'Error: Post ID, user ID, and comment content are required.' });
    }

    // Verify post ID and user ID is a string of 24 hex characters
    if (!/^[0-9a-fA-F]{24}$/.test(_postID) || !/^[0-9a-fA-F]{24}$/.test(_userID)) {
        return res.status(400).json({ 'message': 'Post ID or user ID is invalid.' });
    }

    // Check if the post ID is found in the database.
    const foundPost = await Post.findOne({ _id: new ObjectId(_postID) });

    // If post ID is not found, return an error message.
    if (!foundPost) {
        return res.status(400).json({ 'message': 'Error: Post ID is invalid.' });
    }

    // Finish rest of code here

});
*/

module.exports = { addPost };