const express = require("express");
const router = express.Router()

const authChecker = require("../middlewares/check-auth")

const userController = require("../controllers/user");

router.get('/', authChecker, userController.getUser);

router.post('/sign-in', userController.loginUser);
router.post('', userController.createUser);

router.put('', authChecker, userController.updateUser);

router.delete('', authChecker, userController.deleteUser);

module.exports = router;