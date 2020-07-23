const express = require("express");
const router = express.Router();

const articleRoutes = require('./article');
const profilesRoutes = require('./profiles');
const tagsRoutes = require('./tags');
const usersRoutes = require('./users');

router.use('/user', usersRoutes);
router.use('/articles', articleRoutes);
router.use('/profiles', profilesRoutes);
router.use('/tags', tagsRoutes);

module.exports = router;
