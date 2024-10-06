const express = require('express');
const router = express.Router();
const { addComment, getCommentsByPostId, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:id/comment', authMiddleware, addComment); // Adding a comment
router.get('/:id', getCommentsByPostId); // Fetching comments by post ID
router.delete('/:commentId', authMiddleware, deleteComment); // Deleting a comment

module.exports = router;
