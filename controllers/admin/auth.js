const express = require("express");
const register_admin = require("./register");
const login_admin = require("./login");


const router = express.Router();
router.use(express.json());


router.post("/register", register_admin);
router.post("/login", login_admin);

module.exports = router;
// module.exports = { router, JoinRoom_ }