const express = require('express');
const router = express.Router();
const { addComment, getCommentsByPostId, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:id/comment', authMiddleware, addComment);
router.get('/:id', getCommentsByPostId);
router.delete('/:commentId', authMiddleware, deleteComment);

module.exports = router;
