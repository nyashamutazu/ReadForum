const express = require("express");
const router = express.Router();

const authChecker = require("../middlewares/check-auth");

const profileController = require("../controllers/profile");

router.param('username', profileController.getUserProfile);
router.get('/:username', authChecker, profileController.getUser);

router.post('/:username/follow', authChecker, profileController.followUser);
router.post('/:username/block', authChecker, profileController.blockUser);

router.delete('/:username/follow', authChecker, profileController.unfollowUser);
router.delete('/:username/block', authChecker, profileController.unblockUser);

module.exports = router;