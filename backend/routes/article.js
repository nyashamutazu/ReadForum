const express = require("express");
const router = express.Router()

const authChecker = require("../middlewares/check-auth");

const articleController = require("../controllers/articles");
const commentsController = require("../controllers/comments");


router.param('article', articleController.paramsArticle);
router.param('comment', commentsController.paramsComment);

router.get('', authChecker, articleController.getRecentArticles);
router.get('/feed', authChecker, articleController.getFeedArticles);
router.get('/liked', authChecker, articleController.getLikedArticles);
router.get('/read-later', authChecker, articleController.getReadLaterArticles);

router.get('/:article', authChecker, articleController.getArticle);
router.get('/:article/comments', authChecker, commentsController.getComments);

router.post('', authChecker, articleController.postArticle);
router.post('/:article/liked', authChecker, articleController.likeArticle);
router.post('/:article/comments', authChecker, commentsController.postComment);

router.put('/:article', authChecker, articleController.putArticle);
router.put('/:article/comments', authChecker, commentsController.putComment);

router.delete('/:article', authChecker, articleController.deleteArticle);
router.delete('/:article/liked', authChecker, articleController.unlikeArticle);
router.delete('/:article/comments/:comment', authChecker, commentsController.deleteComment);

module.exports = router;
