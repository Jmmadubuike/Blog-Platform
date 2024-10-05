const Post = require('../models/Post');
const User = require('../models/User');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
};

// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching the post' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      author: req.user.id
    });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating the post' });
  }
};

// Update post (only for post author)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error while updating the post' });
  }
};

// Delete post (only for author or admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the author or an admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting the post' });
  }
};
