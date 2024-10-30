const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment, getCommentsByPostId, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for adding a comment to a specific post
router.post('/', authMiddleware, addComment);

// Route for getting all comments for a specific post
router.get('/', getCommentsByPostId);

// Route for deleting a specific comment by commentId
router.delete('/:commentId', authMiddleware, deleteComment);

module.exports = router;
