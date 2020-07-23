const express = require("express");
const router = express.Router();

const authChecker = require("../middlewares/check-auth");

const tagsRoutes = require("../controllers/tags");

router.get('', tagsRoutes.getAll);

module.exports = router;