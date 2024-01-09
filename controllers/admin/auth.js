const express = require("express");
const register = require("./register")
const login = require("./login")
// const db = require("../routes/db.config");
// const forgotPassword = require("./forgotPassword");
// const confrim_code = require("./confirmReset");
// const createNewPassword = require("./createNewSecret");

const router = express.Router();
router.use(express.json());


router.post("/register", register);
router.post("/login", login);

module.exports = router;
// module.exports = { router, JoinRoom_ }