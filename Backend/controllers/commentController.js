const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { content, parent } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = new Comment({
      content,
      user: req.user.id,
      post: req.params.id,
      parent: parent || null 
    });

    const comment = await newComment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Server error while adding comment' });
  }
};

// Get all comments for a post
exports.getCommentsByPostId = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate('user', 'username');

    // Group comments by parent
    const commentsMap = {};
    comments.forEach(comment => {
      const { parent } = comment;
      if (parent) {
        if (!commentsMap[parent]) {
          commentsMap[parent] = [];
        }
        commentsMap[parent].push(comment);
      }
    });

    const topLevelComments = comments.filter(comment => !comment.parent);
    const response = topLevelComments.map(comment => ({
      ...comment.toObject(),
      replies: commentsMap[comment._id] || []
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching comments' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting the comment' });
  }
};
