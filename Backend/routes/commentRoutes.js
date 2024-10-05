const express = require('express');
const router = express.Router();
const { addComment, getCommentsByPostId, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/:id/comments', authMiddleware, addComment);
router.get('/:id/comments', getCommentsByPostId);
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;
